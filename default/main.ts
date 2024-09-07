import roleHarvester from './role.harvester';
import roleUpgrader from "./role.upgrader";
import roleBuilder from "./role.builder";
import structureTower from "./structure.tower";
import spawnCreeps from "./spawn.creep";

import * as _ from 'lodash';
import memoryCreep from "./memory.creep";

module.exports.loop = function () {
    for(const name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Clearing non-existing creep memory: ${name}`);
        }
    }

    const myStructureKeys = Object.keys(Game.structures);
    const myStructures: Structure<StructureConstant>[] = myStructureKeys.map(key => Game.structures[key]);

    const spawns: StructureSpawn[] = [];
    const towers: StructureTower[] = [];

    for(const struct of myStructures) {
        if(struct.structureType === STRUCTURE_SPAWN) {
            spawns.push(struct as StructureSpawn);
        }
        if(struct.structureType === STRUCTURE_TOWER) {
            towers.push(struct as StructureTower);
        }
    }

    spawns.forEach(spawn => {
        spawnCreeps.spawn(spawn);
    });
    structureTower.run(towers);

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