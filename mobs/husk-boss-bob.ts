const entities = require('entities');
const items = require('items');
const Vector = Java.type('org.bukkit.util.Vector');

export function huskBossBob(loc) {
  const mob = loc.world.spawnEntity(loc, entities['husk']());
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
      setTimeout(function() {
        loop();
      }, 5000);
    }

    // Fireball Attack! (when haz target).
    const target = mob.getTarget();
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
