import MemoryRole from "./memory.creep";

// eslint-disable-next-line import/no-unresolved, sort-imports
import * as _ from "lodash";

let creepSpawn: {
    spawn(spawn: StructureSpawn): void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default creepSpawn = {
    spawn(spawn) {
        // const builders = _.filter(Game.creeps, creep => creep.memory.role === MemoryRole.BUILDER.valueOf());
        // console.log('Builders: ' + builders.length);
        const harvesters = _.filter(Game.creeps, creep => creep.memory.role === MemoryRole.HARVESTER.valueOf());
        // console.log('Harvesters: ' + harvesters.length);
        const upgraders = _.filter(Game.creeps, creep => creep.memory.role === MemoryRole.UPGRADER.valueOf());
        // console.log('Upgraders: ' + upgraders.length);

        createCreep(harvesters, "Harvesters", MemoryRole.HARVESTER, 2, [WORK, CARRY, MOVE]);
        createCreep(upgraders, "Upgraders", MemoryRole.UPGRADER, 3, [WORK, CARRY, CARRY, MOVE, MOVE]);

        if (spawn.spawning) {
            const spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text("🛠️" + spawningCreep.memory.role, spawn.pos.x + 1, spawn.pos.y, {
                align: "left",
                opacity: 0.8
            });
        }
    }
};

function createCreep(creeps: Creep[], name: string, role: MemoryRole, maxNum: number, body: BodyPartConstant[]) {
    if (creeps.length < maxNum) {
        const newName = name + Game.time;
        console.log("Spawning new " + name.toLowerCase() + ": " + newName);
        Game.spawns.Spawn1.spawnCreep(body, newName, {
            memory: { role: role.valueOf() }
        });
    }
}
