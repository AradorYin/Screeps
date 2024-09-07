import roleHarvester from './role.harvester';
import roleUpgrader from "./role.upgrader";
import roleBuilder from "./role.builder";

import * as _ from 'lodash';
import memoryCreep from "./memory.creep";

module.exports.loop = function () {
    for(const name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Clearing non-existing creep memory: ${name}`);
        }
    }

    const tower = Game.getObjectById('75ac8225466583487dd49917' as Id<_HasId>) as StructureTower;
    if(tower) {
        const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == memoryCreep.HARVESTER);
    // console.log('Harvesters: ' + harvesters.length);
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == memoryCreep.UPGRADER);
    // console.log('Upgraders: ' + upgraders.length);
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role == memoryCreep.BUILDER);
    // console.log('Builders: ' + builders.length);

    if(harvesters.length < 2) {
        const newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: memoryCreep.HARVESTER}});
    } else if(upgraders.length < 1) {
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