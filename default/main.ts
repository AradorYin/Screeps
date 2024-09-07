import roleHarvester from './role.harvester';
import roleUpgrader from "./role.upgrader";
import roleBuilder from "./role.builder";
import structureTower from "./structure.tower";

import * as _ from 'lodash';
import memoryCreep from "./memory.creep";

module.exports.loop = function () {
    for(const name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Clearing non-existing creep memory: ${name}`);
        }
    }

    const towers: StructureTower[] = _.filter(Game.structures, structure => {
        return structure.structureType === STRUCTURE_TOWER;
    }) as StructureTower[];
    structureTower.run(towers);

    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == memoryCreep.HARVESTER);
    // console.log('Harvesters: ' + harvesters.length);
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == memoryCreep.UPGRADER);
    // console.log('Upgraders: ' + upgraders.length);
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role == memoryCreep.BUILDER);
    // console.log('Builders: ' + builders.length);

    if(harvesters.length < 4) {
        const newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: memoryCreep.HARVESTER}});
    } else if(upgraders.length < 3) {
        const newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: memoryCreep.UPGRADER}});
    } else if(builders.length < 1) {
        const newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: memoryCreep.BUILDER}});
    }

    if(Game.spawns['Spawn1'].spawning) {
        const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(const name in Game.creeps) {
        const creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}