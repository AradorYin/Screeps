import MemoryRole from "./memory.creep";

import roleBuilder from "./roleBuilder";
import roleHarvester from "./roleHarvester";
import roleUpgrader from "./roleUpgrader";

// eslint-disable-next-line import/no-unresolved, sort-imports
import * as _ from "lodash";

export function loop() {
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log("Clearing non-existing creep memory: ", name);
        }
    }

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

    // const builders = _.filter(Game.creeps, (creep) => creep.memory.role === MemoryRole.BUILDER.valueOf());
    // console.log('Builders: ' + builders.length);
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role === MemoryRole.HARVESTER.valueOf());
    // console.log('Harvesters: ' + harvesters.length);
    const upgraders = _.filter(Game.creeps, creep => creep.memory.role === MemoryRole.UPGRADER.valueOf());
    // console.log('Upgraders: ' + upgraders.length);

    if (harvesters.length < 2) {
        const newName = "Harvester" + Game.time;
        console.log("Spawning new harvester: " + newName);
        Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: MemoryRole.HARVESTER.valueOf() }
        });
    } else if (upgraders.length < 3) {
        const newName = "Upgrader" + Game.time;
        console.log("Spawning new upgrader: " + newName);
        Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: MemoryRole.UPGRADER.valueOf() }
        });
    }
    // else if(builders.length < 1) {
    //     const newName = 'Builder' + Game.time;
    //     console.log('Spawning new builder: ' + newName);
    //     Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: memoryCreep.BUILDER.valueOf()}});
    // }

    if (Game.spawns.Spawn1.spawning) {
        const spawningCreep = Game.creeps[Game.spawns.Spawn1.spawning.name];
        Game.spawns.Spawn1.room.visual.text(
            "🛠️" + spawningCreep.memory.role,
            Game.spawns.Spawn1.pos.x + 1,
            Game.spawns.Spawn1.pos.y,
            { align: "left", opacity: 0.8 }
        );
    }

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
