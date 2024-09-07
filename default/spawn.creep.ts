import * as _ from "lodash";
import memoryCreep from "./memory.creep";

import roleBuilder from "./role.builder";
import roleHarvester from "./role.harvester";
import roleUpgrader from "./role.upgrader";

let spawnCreep: {
    spawn(spawn: StructureSpawn): void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default spawnCreep = {
    spawn(spawn) {
        // eslint-disable-next-line import/namespace
        const harvesters = _.filter(Game.creeps, creep => creep.memory.role === memoryCreep.HARVESTER.valueOf());
        // console.log('Harvesters: ' + harvesters.length); //TODO: make a debug mode used to decide if logged
        // eslint-disable-next-line import/namespace
        const upgraders = _.filter(Game.creeps, creep => creep.memory.role === memoryCreep.UPGRADER.valueOf());
        // console.log('Upgraders: ' + upgraders.length);
        // eslint-disable-next-line import/namespace
        const builders = _.filter(Game.creeps, creep => creep.memory.role === memoryCreep.BUILDER.valueOf());
        // console.log('Builders: ' + builders.length);

        if (harvesters.length < roleHarvester.numHarvester(spawn.room)) {
            const newName = "Harvester" + Game.time;
            console.log("Spawning new harvester: " + newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: memoryCreep.HARVESTER } });
        } else if (upgraders.length < roleUpgrader.numUpgraders(spawn.room, roleHarvester.numHarvester(spawn.room))) {
            const newName = "Upgrader" + Game.time;
            console.log("Spawning new upgrader: " + newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: memoryCreep.UPGRADER } });
        } else if (builders.length < roleBuilder.numBuilders(spawn.room)) {
            const newName = "Builder" + Game.time;
            console.log("Spawning new builder: " + newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: memoryCreep.BUILDER } });
        }

        if (spawn.spawning) {
            const spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text("🛠️" + spawningCreep.memory.role, spawn.pos.x + 1, spawn.pos.y, {
                align: "left",
                opacity: 0.8
            });
        }
    }
};
