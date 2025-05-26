import Roadmap from '../../models/roadmapModel.js';
import associateUserWithRoadmap from './associateUserWithRoadmap.js';

export const saveRoadmapToDB = async (parsedRoadmap, userId) => {
  let savedRoadmap = await Roadmap.findOne({
    roadmapTitle: parsedRoadmap.roadmapTitle,
  });
  if (!savedRoadmap) {
    savedRoadmap = await Roadmap.create(parsedRoadmap);
  }
  console.log('savedRoadmap>>', savedRoadmap);
  if (userId) {
    await associateUserWithRoadmap(userId, savedRoadmap._id);
  }
  return {
    roadmap: {
      roadmapTitle: savedRoadmap.roadmapTitle,
      modules: savedRoadmap.modules,
      _id: savedRoadmap._id,
    },
  };
};
export default saveRoadmapToDB;
