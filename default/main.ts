import MemoryRole from "./memory.creep";

import roleBuilder from "./roleBuilder";
import roleHarvester from "./roleHarvester";
import roleUpgrader from "./roleUpgrader";
import spawnCreeps from "./spawner";

export function loop() {
    /*
    The below is for clearing up memory. Later, this will change to be more advanced memory management with using the CPU bucket.
    * Removal of creep names
    */
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log("Clearing non-existing creep memory: ", name);
        }
    }

    const myStructureKeys = Object.keys(Game.structures);
    const myStructures: Structure<StructureConstant>[] = myStructureKeys.map(key => Game.structures[key]);

    const spawns: StructureSpawn[] = [];

    for (const struct of myStructures) {
        if (struct.structureType === STRUCTURE_SPAWN) {
            spawns.push(struct as StructureSpawn);
        }
    }

    spawns.forEach(spawn => {
        spawnCreeps.spawn(spawn);
    });

    const tower = Game.getObjectById("914f4d1ec22dafd8d040197c" as Id<_HasId>) as StructureTower;
    if (tower) {
        const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: structure => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    /*
    The below is for setting the roles of the creeps to the creep memory.

    TODO: Move this into a class designed for handling creeps, role setting, spawning, defense
    */
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === MemoryRole.HARVESTER.valueOf()) {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === MemoryRole.UPGRADER.valueOf()) {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === MemoryRole.BUILDER.valueOf()) {
            roleBuilder.run(creep);
        }
    }
}
