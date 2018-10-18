"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var entities = require('entities');
var items = require('items');
var Vector = Java.type('org.bukkit.util.Vector');
function huskBoss(loc) {
    var mob = loc.world.spawnEntity(loc, entities['husk']());
    mob.getEquipment().setItemInHand(items['diamondSword'](1));
    // mob.getEquipment().setBoots(items['diamondBoots'](1));
    // mob.getEquipment().setLeggings(items['diamondLeggings'](1));
    // mob.getEquipment().setChestplate(items['diamondChestplate'](1));
    mob.getEquipment().setHelmet(items['diamondHelmet'](1));
    mob.setCustomName('Bob the Terrible');
    // behavior loop
    function loop() {
        // Keep looping while mob is alive.
        if (mob.isDead()) {
            return;
        }
        else {
            setTimeout(function () {
                loop();
            }, 5000);
        }
        // Fireball Attack! (when haz target).
        var target = mob.getTarget();
        if (target && target.type == 'PLAYER') {
            var fb = Java.type("org.bukkit.entity.Fireball").class;
            var pl = target.location;
            var ml = mob.location;
            var vec = new Vector(pl.x - ml.x, pl.y - ml.y, pl.z - ml.z).normalize();
            mob.launchProjectile(fb, vec);
        }
    }
    loop();
    return mob;
}
exports.huskBoss = huskBoss;
