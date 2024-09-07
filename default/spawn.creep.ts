import * as _ from "lodash";
import memoryCreep from "./memory.creep";

let spawnCreep: {
    spawn(spawn: StructureSpawn): void;
}

export default spawnCreep = {
    spawn(spawn) {
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == memoryCreep.HARVESTER);
        // console.log('Harvesters: ' + harvesters.length); //TODO: make a debug mode used to decide if logged
        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == memoryCreep.UPGRADER);
        // console.log('Upgraders: ' + upgraders.length);
        const builders = _.filter(Game.creeps, (creep) => creep.memory.role == memoryCreep.BUILDER);
        // console.log('Builders: ' + builders.length);

        if(harvesters.length < 4) {
            const newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: memoryCreep.HARVESTER}});
        } else if(upgraders.length < 3) {
            const newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: memoryCreep.UPGRADER}});
        } else if(builders.length < 1) {
            const newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: memoryCreep.BUILDER}});
        }

        if(spawn.spawning) {
            const spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
        }
    }
}
