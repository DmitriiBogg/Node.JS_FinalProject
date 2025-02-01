const Achievement = require('../models/achievement.model');
const Character = require('../models/character.model');

module.exports = {
  createAchievement: async (req, res, next) => {
    try {
      const { title, description, criteria, threshold, reward } = req.body;
      const achievement = await Achievement.create({
        title,
        description,
        criteria,
        threshold,
        reward,
      });
      res.status(201).json(achievement);
    } catch (err) {
      next(err);
    }
  },
  assignAchievement: async (req, res, next) => {
    try {
      const { characterId } = req.body;

      // Проверка на наличие characterId
      if (!characterId) {
        return res.status(401).json({ error: 'Character ID is required' });
      }

      const achievement = await Achievement.findById(req.params.achievementId);
      if (!achievement) {
        return res.status(404).json({ error: 'Achievement not found' });
      }

      const character = await Character.findById(characterId);
      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      if (
        character.achievements &&
        character.achievements.includes(req.params.achievementId)
      ) {
        return res
          .status(400)
          .json({ error: 'Achievement already assigned to this character.' });
      }

      character.achievements = character.achievements || []; // Защита от null
      character.achievements.push(req.params.achievementId);
      await character.save();

      res
        .status(200)
        .json({ message: 'Achievement assigned successfully', character });
    } catch (err) {
      next(err);
    }
  },
  checkAndAssignAchievements: async (character) => {
    try {
      const achievements = await Achievement.find();

      character.achievements = character.achievements || []; // Защита от null

      for (const achievement of achievements) {
        if (!character.achievements.includes(achievement._id)) {
          // проверка условий для достижения
          if (
            (achievement.criteria === 'gold' &&
              character.gold >= achievement.threshold) ||
            (achievement.criteria === 'level' &&
              character.level >= achievement.threshold) ||
            (achievement.criteria === 'quests' &&
              character.completedQuests >= achievement.threshold)
          ) {
            character.achievements.push(achievement._id);
            console.log(
              `Achievement "${achievement.title}" assigned to character "${character.name}"`,
            );
          }
        }
      }

      await character.save();
    } catch (err) {
      console.error('Error assigning achievements:', err);
    }
  },

  renderAchievements: async (req, res, next) => {
    try {
      const achievements = await Achievement.find();
      res.render('achievements', { achievements });
    } catch (err) {
      next(err);
    }
  },
};
