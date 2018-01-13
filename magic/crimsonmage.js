//////////////////////////////////////////////////////////////////////////////
//
//  a ScriptCraft plugin that expands Minecraft's magic system
//
//  this plugin allows the player to cast specific enchantments at specific
//  levels (instead of relying on the normal random enchantment mechanism),
//  to cast spells for various effects (similar to using potions, but more
//  like a wizard), and to fashion wands which cast various offensive and
//  defensive spells (to add breadth to Minecraft combat)
//
//  copyright 2018  Andrew Witt  landru729@gmail.com
//  released under the MIT License
//
//////////////////////////////////////////////////////////////////////////////
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included
//  in all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
//  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//
//////////////////////////////////////////////////////////////////////////////
//
//  when a player provides a book and quill as the item on his/her enchanting
//  table, that book is turned into one of a couple of different spellbooks,
//  and placed into his/her inventory
//
//  one spellbook is for enchantment spells, and one is for wizard spells:
//  various effects, defenses, and attacks
//
//  when a player provides a blaze rod as the item on his/her enchanting
//  table, that blaze rod is fashioned into a spell casting wand, depending
//  on the reagents supplied (by having them in inventory)
//
//////////////////////////////////////////////////////////////////////////////
//
//  enchantments are cast by selecting them from the spellbook, while in front
//  of an enchanting table  (the player must in fact be looking at his/her
//  enchanting table, which requires a 'sneak-use' (e.g., shift-right-click)
//  to open the spellbook)
//
//  wizard spells are cast by selecting them from the spellbook as needed
//
//  wands are used by waving them with a 'use' action (e.g., left-click)
//
//  both enchantments and wizard spells take lapis lazuli, redstone, and
//  an appropriate reagent to be cast; the higer the spell level, the more
//  of each is used; for enchantments, blocks of redstone are used, but
//  experience levels can be used instead, similar to how enchantment
//  normally costs XP; for wizard spells, redstone dust is used; XP level
//  limits both enchantments and wizard spells, but only enchantments use
//  up XP levels (when there are not enough blocks of redstone)
//
//  wands do not require any ingredients to use, but take lapis lazuli,
//  redstone, and an appropriate reagent to fashion
//
//  enchantments are listed in their spellbook along with a level; wizard
//  spells are cast at the highest level possible, limited by the player's
//  XP level and the ingredients available in his/her immediate inventory
//  ('hotbar' inventory); this allows a player to carry ingredients for many
//  high-powered spells, but still only cast one of a specific level (by
//  keeping the excess in the general inventory ('UI' inventory)
//
//  a player must have 10 XP levels for each level of spell being cast; e.g.,
//  20th XP level to cast any level II spell; 50th XP level to cast any level
//  V spell; etc.
//
//  enchantments stack in the normal way; this means that an item can have
//  multiple enchantments, and that an existing enchantment's level can be
//  increased -- Minecraft automatically replaces the lower level enchantment
//  of the same type
//
//  wizard spells that cause an effect on the player last 2 minutes for each
//  level at which the spell is cast
//
//  some wizard spells have a maximum effective level (amplifier), in which
//  case, the effect is applied at the maximum effective level, but the
//  duration of the spell still corresponds to the level at which available
//  ingredients allow it to be cast; e.g., a level 7 Water Breathing spell
//  grants Water Breating III, but lasts 14 minutes, and costs 7 each of
//  lapis lazuli, redstone dust, and reagent
//
//////////////////////////////////////////////////////////////////////////////
//
//  enchantment           translation        reagent            qty (per level)
//  ------------------    ---------------    ----------------   ---
//  Respiration           Respiration        raw fish             8
//  Depth Strider         Depth Strider      ink sack             8
//  Frost Walker          Frost Walker       packed ice           8
//
//  Mending Pickaxe       Mending            blaze rod            8
//  Silk Touch            Silk Touch         string              32
//  Fortune               Fortune            rabbit foot         16
//  Efficiency            Efficiency         quartz               8
//
//  Feather Falling       Feather Falling    feather             16
//  Protection            Protection         ghast tear           2
//
//  Mending Sword         Mending            blaze rod            8
//  Vorbal Blade          Sharpness          prismarine shard    12
//  Flaming Sword         Fire Aspect        gunpowder            4
//
//  Power                 Power              ender pearl          4
//  Flaming Arrows        Flame              magma cream         16
//  Infinity Bow          Infinity           glowstone dust      64
//
//  Unbreaking Pickaxe    Unbreaking         obsidian             8
//  Unbreaking Sword      Unbreaking         obsidian             8
//
//
//  wizard spell          translation        reagent
//  ------------------    ---------------    ----------------
//  Jump                  Jump               rabbit hide
//  Speed                 Speed              sugar
//  Strength              Strength           blaze powder
//  Water Breathing       Water Breathing    raw fish
//  Night Vision          Night Vision       golden carrot
//  Invisibility          Invisibility       fermented spider eye
//
//  Sustenance            Saturation         mycelium
//  Protection            Absorption         blaze powder
//  Healing               Instant Health     golden melon
//  Healing Aura          Instant Health     golden apple    (cloud effect)
//  Regeneration          Regeneration       ghast tear
//
//
//  wand                  translation        reagent
//  ------------------    ---------------    ----------------
//  Arrowfall             multiple arrows    flint           (narrow cone)
//  Fireball              ghast fireball     magma cream     (one fireball)
//  Firestorm             blaze fireballs    magma           (spread)
//  Firestrike            targeted fire      magma           (nearby mobs)
//  Lightning Strike      lightning strikes  blaze rod       (nearby mobs)
//
//////////////////////////////////////////////////////////////////////////////
//
//  enchantments cost:      lapis lazuli    :  1 per enchantment level
//                          redstone blocks :  1 for level I
//                          and/or XP levels   3 for level II
//                                             5 for level III
//                                             7 for level IV
//                                             9 for level V
//                          reagent         :  1 qty per enchantment level
//
//  wizard spells cost:     lapis lazuli    :  1 per level
//                          redstone dust   :  1 per level
//                          reagent         :  1 per level
//
//  fashion wand cost:      lapis lazuli    : 64
//                          redstone dust   : 64
//                          reagent         : 32
//
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
//  import ScriptCraft modules
//
var utils = require('utils');
var events = require('events');
var slash = require('slash');
var items = require('items');
var inventory = require('inventory');


//////////////////////////////////////////////////////////////////////////////
//  define data structures
//////////////////////////////////////////////////////////////////////////////
//
// define the enchantments that we support in this plugin
//
// 'name'         is our name for the enchantment being cast, which in many cases
//                matches the normal Minecraft name, but there is no actual tie
//
// 'enchantment'  is the Minecraft/Bukkit/Spigot Enchantment object
//
// 'reagent'      defines the ingredient required to cast this enchantment; the
//                'amount' is per level of the enchantment being cast
//
// 'targetItem'   is the type of item that can have this enchantment applied; we
//                are much narrower than what the normal Minecraft enchantment
//                mechanism allows, but this suits the target game play; this
//                plugin is certainly open to modification for adaptation to a
//                broader sort of gameplay
//
var enchantments = {
    'respiration': {
        name: 'Respiration',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('OXYGEN'),
        reagent: {
            item: org.bukkit.Material.RAW_FISH,
            amount: 8
        },
        targetItem: org.bukkit.Material.IRON_HELM
    },

    'depthstrider': {
        name: 'Depth Strider',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DEPTH_STRIDER'),
        reagent: {
            item: org.bukkit.Material.INK_SACK,
            amount: 8
        },
        targetItem: org.bukkit.Material.LEATHER_BOOTS
    },
    'frostwalker': {
        name: 'Frost Walker',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('FROST_WALKER'),
        reagent: {
            item: org.bukkit.Material.PACKED_ICE,
            amount: 8
        },
        targetItem: org.bukkit.Material.LEATHER_BOOTS
    },

    'mendingpickaxe': {
        name: 'Mending Pickaxe',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('MENDING'),
        reagent: {
            item: org.bukkit.Material.BLAZE_ROD,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'silktouch': {
        name: 'Silk Touch',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('SILK_TOUCH'),
        reagent: {
            item: org.bukkit.Material.STRING,
            amount: 32
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'fortune': {
        name: 'Fortune',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('LOOT_BONUS_BLOCKS'),
        reagent: {
            item: org.bukkit.Material.RABBIT_FOOT,
            amount: 16
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'efficiency': {
        name: 'Efficiency',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DIG_SPEED'),
        reagent: {
            item: org.bukkit.Material.QUARTZ,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },

    'featherfalling': {
        name: 'Feather Falling',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('PROTECTION_FALL'),
        reagent: {
            item: org.bukkit.Material.FEATHER,
            amount: 16
        },
        targetItem: org.bukkit.Material.IRON_LEGGINGS
    },

    'protection': {
        name: 'Protection',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('PROTECTION_ENVIRONMENTAL'),
        reagent: {
            item: org.bukkit.Material.GHAST_TEAR,
            amount: 2
        },
        targetItem: org.bukkit.Material.IRON_CHESTPLATE
    },

    'mendingsword': {
        name: 'Mending Sword',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('MENDING'),
        reagent: {
            item: org.bukkit.Material.BLAZE_ROD,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    },
    'vorpalblade': {
        name: 'Vorbal Blade',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DAMAGE_ALL'),
        reagent: {
            item: org.bukkit.Material.PRISMARINE_SHARD,
            amount: 12
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    },
    'flamingsword': {
        name: 'Flaming Sword',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('FIRE_ASPECT'),
        reagent: {
            item: org.bukkit.Material.SULPHUR,
            amount: 4
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    },

    'power': {
        name: 'Power',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('ARROW_DAMAGE'),
        reagent: {
            item: org.bukkit.Material.ENDER_PEARL,
            amount: 4
        },
        targetItem: org.bukkit.Material.BOW
    },
    'flamingarrows': {
        name: 'Flaming Arrows',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('ARROW_FIRE'),
        reagent: {
            item: org.bukkit.Material.MAGMA_CREAM,
            amount: 16
        },
        targetItem: org.bukkit.Material.BOW
    },
    'infinitybow': {
        name: 'Infinity Bow',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('ARROW_INFINITE'),
        reagent: {
            item: org.bukkit.Material.GLOWSTONE_DUST,
            amount: 64
        },
        targetItem: org.bukkit.Material.BOW
    },

    'unbreakingpickaxe': {
        name: 'Unbreaking Pickaxe',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DURABILITY'),
        reagent: {
            item: org.bukkit.Material.OBSIDIAN,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'unbreakingsword': {
        name: 'Unbreaking Sword',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DURABILITY'),
        reagent: {
            item: org.bukkit.Material.OBSIDIAN,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    }
};

// define the wizard spells that we support in this plugin
//
// 'name'         is our name for the spell being cast, which in many cases
//                matches the normal Minecraft name, but there is no actual tie
//
// 'effect'       is the Minecraft/Bukkit/Spigot Effect object; if present, the
//                spell applies this effect to the player; if absent, the spell
//                does something more specific
//
// 'reagent'      defines the ingredient required to cast this spell
//
var wizardspells = {
    'jump': {
        name: 'Jump',
        effect: org.bukkit.potion.PotionEffectType.JUMP,
        maxlevel: 15,
        reagent: org.bukkit.Material.RABBIT_HIDE
    },
    'speed': {
        name: 'Speed',
        effect: org.bukkit.potion.PotionEffectType.SPEED,
        maxlevel: 15,
        reagent: org.bukkit.Material.SUGAR
    },
    'strength': {
        name: 'Strength',
        effect: org.bukkit.potion.PotionEffectType.INCREASE_DAMAGE,
        maxlevel: 15,
        reagent: org.bukkit.Material.BLAZE_POWDER
    },
    'waterbreathing': {
        name: 'Water Breathing',
        effect: org.bukkit.potion.PotionEffectType.WATER_BREATHING,
        maxlevel: 15,
        reagent: org.bukkit.Material.RAW_FISH
    },
    'nightvision': {
        name: 'Night Vision',
        effect: org.bukkit.potion.PotionEffectType.NIGHT_VISION,
        maxlevel: 1,
        reagent: org.bukkit.Material.GOLDEN_CARROT
    },
    'invisibility': {
        name: 'Invisibility',
        effect: org.bukkit.potion.PotionEffectType.INVISIBILITY,
        maxlevel: 1,
        reagent: org.bukkit.Material.FERMENTED_SPIDER_EYE
    },

    'sustenance': {
        name: 'Sustenance',
        effect: org.bukkit.potion.PotionEffectType.SATURATION,
        maxlevel: 30,
        reagent: org.bukkit.Material.MYCEL
    },
    'protection': {
        name: 'Protection',
        effect: org.bukkit.potion.PotionEffectType.ABSORPTION,
        maxlevel: 5,
        reagent: org.bukkit.Material.BLAZE_POWDER
    },
    'healing': {
        name: 'Healing',
        effect: org.bukkit.potion.PotionEffectType.HEAL,
        maxlevel: 30,
        reagent: org.bukkit.Material.SPECKLED_MELON
    },
    'healingaura': {
        name: 'Healing Aura',
        effect: org.bukkit.potion.PotionEffectType.HEAL,
        maxlevel: 15,
        reagent: org.bukkit.Material.GOLDEN_APPLE
    },
    'regeneration': {
        name: 'Regeneration',
        effect: org.bukkit.potion.PotionEffectType.REGENERATION,
        maxlevel: 5,
        reagent: org.bukkit.Material.GHAST_TEAR
    }
};

// define the spell casting wands that we support in this plugin
//
// 'name'         is our name for the spell being cast
//
// 'reagent'      defines the ingredient required to fashion a wand
//                for casting this spell
//
var wizardwands = {
    'arrowfall': {
        name: 'Wand of Arrowfall',
        reagent: org.bukkit.Material.FLINT,
        spellfunc: function(player) {
                       repeatwithdelay(function() {
                           var playerlocation = player.location;
                           var playerworld = playerlocation.world;
                           var playerdirection = player.location.direction;
                           var aheadofplayer = player.location.add(0.0, 1.7, 0.0).add(playerdirection.normalize().multiply(2));

                           playerworld.spawnArrow(aheadofplayer, playerdirection, 3, 1);
                       }, 200, 8, true);
                   }
    },
    'fireball': {
        name: 'Fireball Wand',
        reagent: org.bukkit.Material.MAGMA_CREAM,
        spellfunc: function(player) {
                       var playerlocation = player.location;
                       var playerworld = playerlocation.world;
                       var playerdirection = player.location.direction;
                       var aheadofplayer = player.location.add(0.0, 1.3, 0.0).add(playerdirection);

                       playerworld.spawnEntity(aheadofplayer, org.bukkit.entity.EntityType.FIREBALL);
                   }
    },
    'firestorm': {
        name: 'Firestorm Wand',
        reagent: org.bukkit.Material.SULPHUR,
        spellfunc: function(player) {
                       repeatwithdelay(function() {
                           var playerlocation = player.location;
                           var playerworld = playerlocation.world;
                           var playerdirection = player.location.direction;
                           var aheadofplayer = player.location.add(0.0, 1.7, 0.0).add(playerdirection.normalize().multiply(2));

                           playerworld.spawnEntity(aheadofplayer, org.bukkit.entity.EntityType.SMALL_FIREBALL);
                       }, 200, 8, true);
                   }
    },
    'firestrike': {
        name: 'Firestrike Wand',
        reagent: org.bukkit.Material.MAGMA,
        spellfunc: function(player) {
                       var playerlocation = player.location;
                       var playerworld = playerlocation.world;

                       var nearby = playerworld.getNearbyEntities(playerlocation, 8.0, 8.0, 8.0);
                       var qtynearby = nearby.length;
                       for (var indx = 0; indx < qtynearby; indx++) {
                           if ((nearby[indx].getType() == org.bukkit.entity.EntityType.CAVE_SPIDER) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.CREEPER) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.EVOKER) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.GIANT) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.HUSK) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.ILLUSIONER) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.SKELETON) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.SKELETON_HORSE) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.SLIME) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.SPIDER) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.STRAY) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.VEX) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.VINDICATOR) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.WITCH) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.ZOMBIE) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.ZOMBIE_HORSE) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.ZOMBIE_VILLAGER)) {

                               playerworld.getBlockAt(nearby[indx].getLocation()).setType(org.bukkit.Material.FIRE);
                           }
                       }
                   }
    },
    'lightningstrike': {
        name: 'Wand of Lightning',
        reagent: org.bukkit.Material.BLAZE_ROD,
        spellfunc: function(player) {
                       var playerlocation = player.location;
                       var playerworld = playerlocation.world;

                       var nearby = playerworld.getNearbyEntities(playerlocation, 8.0, 8.0, 8.0);
                       var qtynearby = nearby.length;
                       for (var indx = 0; indx < qtynearby; indx++) {
                           if ((nearby[indx].getType() == org.bukkit.entity.EntityType.CAVE_SPIDER) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.CREEPER) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.EVOKER) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.GIANT) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.HUSK) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.ILLUSIONER) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.SKELETON) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.SKELETON_HORSE) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.SLIME) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.SPIDER) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.STRAY) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.VEX) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.VINDICATOR) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.WITCH) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.ZOMBIE) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.ZOMBIE_HORSE) ||
                               (nearby[indx].getType() == org.bukkit.entity.EntityType.ZOMBIE_VILLAGER)) {

                               playerworld.strikeLightning(nearby[indx].getLocation());
                           }
                       }
                   }
    }
};


//////////////////////////////////////////////////////////////////////////////
//  for tracking the granting of the spellbooks
//
var store = persist('spellbooks', {players: {}});


//////////////////////////////////////////////////////////////////////////////
//  define our /jsp commands
//////////////////////////////////////////////////////////////////////////////
//
// this is the /jsp command for casting an enchantment
//
// this is not intended to be used directly, but through the spellbook that this
// plugin grants the player when he/she crafts a book and quill at an enchantment table;
// this meshes better with normal Survival gameplay, where /commands are used very
// little, if at all
//
// but, nothing apart from awareness and command permissions stops a player from
// issuing these enchantitem commands directly
//
command('enchantitem', function(parameters, player) {
    // check that the player is near enough to and looking at his/her
    // enchantment table
    var targetPos = utils.getMousePos(player.name);
    if (targetPos === null) {
        echo(player, 'you must be looking at your enchantment table');
        return;
    }
    var targetBlock = utils.blockAt(targetPos);
    if (targetBlock === null) {
        echo(player, 'you must be looking at your enchantment table');
        return;
    }
    if (targetBlock.getType() !== org.bukkit.Material.ENCHANTMENT_TABLE) {
        echo(player, 'you must be looking at your enchantment table');
        return;
    }

    var enchantmentname = parameters[0];
    var enchantmentlevel = parameters[1];

    // check syntax
    if (enchantmentname === undefined) {
        echo(player, 'you must state what enchantment you are performing');
        return;
    }
    if (enchantmentlevel === undefined) {
        echo(player, 'you must state the level of enchantment you desire');
        return;
    }

    // check bounds
    if (enchantmentlevel == 'I')   { enchantmentlevel = 1; }
    if (enchantmentlevel == 'II')  { enchantmentlevel = 2; }
    if (enchantmentlevel == 'III') { enchantmentlevel = 3; }
    if (enchantmentlevel == 'IV')  { enchantmentlevel = 4; }
    if (enchantmentlevel == 'V')   { enchantmentlevel = 5; }
    if ((enchantmentlevel < 1) || (enchantmentlevel > 5)) {
        echo(player, 'the level of enchantment must be between 1 and 5');
        return;
    }

    // the player must have an XP level of at least 10x the spell level
    if (player.getLevel() < (10 * enchantmentlevel)) {
        echo(player, 'you must be at least ' + (10 * enchantmentlevel) + 'th level to cast a spell of that level');
        return;
    }

    // fetch the enchantment defintion from our data object
    var enchantmentdefinition = enchantments[enchantmentname];

    var displayname = enchantmentdefinition.name;
    if (enchantmentlevel == 1) { displayname += ' I'; }
    if (enchantmentlevel == 2) { displayname += ' II'; }
    if (enchantmentlevel == 3) { displayname += ' III'; }
    if (enchantmentlevel == 4) { displayname += ' IV'; }
    if (enchantmentlevel == 5) { displayname += ' V'; }

    // is there a method on ItemStack, Material, or related to fetch the actual friendly name for an item?
    var displaynameitem = enchantmentdefinition.targetItem.name();
    displaynameitem = displaynameitem.replace(/_/g, ' ');
    displaynameitem = displaynameitem.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

    var displaynamereagent = enchantmentdefinition.reagent.item.name();
    displaynamereagent = displaynamereagent.replace(/_/g, ' ');
    displaynamereagent = displaynamereagent.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

    // check bounds
    if (enchantmentlevel > enchantmentdefinition.enchantment.getMaxLevel()) {
        echo(player, 'the enchantment ' + enchantmentdefinition.name + ' has a maximum level of ' + enchantmentdefinition.enchantment.getMaxLevel());
        return;
    }

    var playerinventory = player.getInventory().getContents();

    // the item to be enchanted goes in the 1st inventory slot
    if (playerinventory[0] === null) {
        echo(player, 'place the item to be enchanted in your 1st inventory slot');
        return;
    }
    if (playerinventory[0].getType() != enchantmentdefinition.targetItem) {
        echo(player, 'the enchantment ' + enchantmentdefinition.name + ' must be performed on ' + displaynameitem);
        return;
    }

    // lapis lazuli goes in the 2nd inventory slot
    var lapisCost = enchantmentlevel;
    if (playerinventory[1] === null) {
        echo(player, 'place some lapis lazuli in your 2nd inventory slot');
        return;
    }
    // yes: lapis lazuli is actually a squid's ink sack, colored blue ... >sigh<
    if ((playerinventory[1].getType()            != org.bukkit.Material.INK_SACK) ||
        (playerinventory[1].getData().getColor() != org.bukkit.DyeColor.BLUE)) {
        echo(player, 'place some lapis lazuli in your 2nd inventory slot');
        return;
    }
    if (playerinventory[1].getAmount() < lapisCost) {
        echo(player, 'the enchantment ' + displayname + ' requires at least ' + lapisCost + ' lapis lazuli');
        return;
    }

    // a stack of redstone blocks goes in the 3rd inventory slot
    // XP levels will be expended in place of an insufficient quantity of redstone blocks
    var redstone = 0;
    var rsxpCost = (enchantmentlevel * 2) - 1;
    var redstoneCost = 0;
    var xplvlCost = 0;
    if ((playerinventory[2] !== null) && (playerinventory[2].getType() == org.bukkit.Material.REDSTONE_BLOCK)){
        redstone = playerinventory[2].getAmount();
    }
    if (redstone >= rsxpCost) {
        redstoneCost = rsxpCost;
        xplvlCost = 0;
    } else {
        redstoneCost = redstone;
        xplvlCost = rsxpCost - redstoneCost;
    }

    // the spell reagent goes in the 4th inventory slot
    var reagentCost = enchantmentdefinition.reagent.amount * enchantmentlevel;
    if (playerinventory[3] === null) {
        echo(player, 'place the spell reagents in your 4th inventory slot');
        return;
    }
    if (playerinventory[3].getType() != enchantmentdefinition.reagent.item) {
        echo(player, 'the enchantment ' + enchantmentdefinition.name + ' must be performed with ' + displaynamereagent);
        return;
    }
    if (playerinventory[3].getAmount() < reagentCost) {
        echo(player, 'the enchantment ' + displayname + ' must be performed with at least ' + reagentCost + ' ' + displaynamereagent);
        return;
    }

    // huzzah! apply the enchantment
    playerinventory[0].addEnchantment(enchantmentdefinition.enchantment, enchantmentlevel);

    // consume the lapis lazuli, redstone blocks and/or XP levels, and reagent
    playerinventory[1].setAmount(playerinventory[1].getAmount() - lapisCost);
    if (redstoneCost > 0) { playerinventory[2].setAmount(playerinventory[2].getAmount() - redstoneCost); }
    if (xplvlCost    > 0) { player.setLevel(player.getLevel() - xplvlCost); }
    playerinventory[3].setAmount(playerinventory[3].getAmount() - reagentCost);

    // feedback to the player
    echo(player, 'your ' + displaynameitem + ' has been enchanted with ' + displayname);
});

// this is the /jsp command for casting a wizard spell
//
// this is not intended to be used directly, but through the spellbook that this
// plugin grants the player when he/she crafts a book and quill at an enchantment table;
// this meshes better with normal Survival gameplay, where /commands are used very
// little, if at all
//
// but, nothing apart from awareness and command permissions stops a player from
// issuing these wizardspell commands directly
//
command('wizardspell', function(parameters, player) {
    var wizardspellname = parameters[0];

    // check syntax
    if (wizardspellname === undefined) {
        echo(player, 'you must state what wizard spell you are casting');
        return;
    }

    // fetch the wizard spell defintion from our data object
    var wizardspelldefinition = wizardspells[wizardspellname];

    // initialize the check for spellcasting components
    var xplvl = Math.floor(player.getLevel() / 10);
    var lapis = 0;
    var rdust = 0;
    var ragnt = 0;

    var playerinventory = player.getInventory().getContents();
    var indx = 0;
    var indxlapis = 0;
    var indxrdust = 0;
    var indxragnt = 0;

    // check for spellcasting components
    for (indx = 0; indx < 9; indx++) {
        if (playerinventory[indx] === null) {
            continue;
        }

        // yes: lapis lazuli is actually a squid's ink sack, colored blue ... >sigh<
        if ((playerinventory[indx].getType()            == org.bukkit.Material.INK_SACK) &&
            (playerinventory[indx].getData().getColor() == org.bukkit.DyeColor.BLUE)) {
            lapis = playerinventory[indx].getAmount();
            indxlapis = indx;
        }

        if (playerinventory[indx].getType() == org.bukkit.Material.REDSTONE) {
            rdust = playerinventory[indx].getAmount();
            indxrdust = indx;

        if (playerinventory[indx].getType() == wizardspelldefinition.reagent) {
            ragnt = playerinventory[indx].getAmount();
            indxragnt = indx;
        }
        }
    }

    // the lowest available component amount determines the spell level
    var spelllevel = Math.min(xplvl, lapis, rdust, ragnt);

    // ... and if that's zero, it's a whole lotta NOPE!
    if (spelllevel == 0) {
        echo(player, 'you are not properly prepared to cast ' + wizardspelldefinition.name);
        return;
    }

    // consume the lapis lazuli, redstone dust, and reagent
    playerinventory[indxlapis].setAmount(playerinventory[indxlapis].getAmount() - spelllevel);
    playerinventory[indxrdust].setAmount(playerinventory[indxrdust].getAmount() - spelllevel);
    playerinventory[indxragnt].setAmount(playerinventory[indxragnt].getAmount() - spelllevel);

    // cast the spell
    duration = 20 * 120 * spelllevel;
    amplifier = Math.min(spelllevel, wizardspelldefinition.maxlevel);
    player.addPotionEffect(wizardspelldefinition.effect.createEffect(duration, amplifier), true);

    // feedback to the player
    echo(player, 'you have cast ' + wizardspelldefinition.name + ' at level ' + spelllevel);
});


//////////////////////////////////////////////////////////////////////////////
//  event handling
//////////////////////////////////////////////////////////////////////////////

function grantSpellbook(event) {
    // the player might be using the enchanting table for a normal enchantment, in
    // which case, we bow out
    enchitem = event.getItem();
    if (enchitem.getType() != org.bukkit.Material.BOOK_AND_QUILL) {
        return;
    }

    var player = event.getEnchanter();

    // grant each spellbook only once; this can be cleared, but in a more competitive
    // context it should be very difficult to regain lost spellbooks
    //
    var hasplayer = store.players[player.name];
    if (!hasplayer) {
        store.players[player.name] = {};
        store.players[player.name].enchantments = false;
        store.players[player.name].wizardry = false;
    }
    var hasbook = store.players[player.name].enchantments;
    if ((!hasbook) || (hasbook == false)) {
        // is there a better way to call our own "command('enchantmentsbook', ..." method?
        //
        // we do it this way to stay DRY, for support of both the event listening and a non-event
        // way to perform the same operation;  is this the best way to accomplish that?
        slash('jsp enchantmentsbook', player);

        // consume the book and quill provided
        enchitem.setAmount(0);

        // mark the fact that the player now has this spellbook
        store.players[player.name].enchantments = true;
        return;
    }

    hasbook = store.players[player.name].wizardry;
    if ((!hasbook) || (hasbook == false)) {
        // is there a better way to call our own "command('wizardrybook', ..." method?
        //
        // we do it this way to stay DRY, for support of both the event listening and a non-event
        // way to perform the same operation;  is this the best way to accomplish that?
        slash('jsp wizardrybook', player);

        // consume the book and quill provided
        enchitem.setAmount(0);

        // mark the fact that the player now has this spellbook
        store.players[player.name].wizardry = true;
        return;
    }
}

function fashionWand(event) {
    // the player might be using the enchanting table for a normal enchantment, in
    // which case, we bow out
    var enchitem = event.getItem();
    if (enchitem.getType() != org.bukkit.Material.BLAZE_ROD) {
        return;
    }

    // we consume the item on the enchantment table to prevent multiple event firings;
    // in cases where we return early, we drop a new blaze rod for immediate pick-up
    enchitem.setAmount(0);

    var player = event.getEnchanter();

    var playerinventory = player.getInventory().getContents();
    var playerlocation = player.location;
    var playerworld = playerlocation.world;

    // lapis lazuli goes in the 1st inventory slot
    var lapisCost = 64;
    if (playerinventory[0] === null) {
        echo(player, 'fashioning a wand requires ' + lapisCost + ' lapis lazuli in your 1st inventory slot');
        dropNewBlazeRod(playerlocation);
        return;
    }
    // yes: lapis lazuli is actually a squid's ink sack, colored blue ... >sigh<
    if ((playerinventory[0].getType()            != org.bukkit.Material.INK_SACK) ||
        (playerinventory[0].getData().getColor() != org.bukkit.DyeColor.BLUE)) {
        echo(player, 'fashioning a wand requires ' + lapisCost + ' lapis lazuli in your 1st inventory slot');
        dropNewBlazeRod(playerlocation);
        return;
    }
    if (playerinventory[0].getAmount() < lapisCost) {
        echo(player, 'fashioning a wand requires ' + lapisCost + ' lapis lazuli in your 1st inventory slot');
        dropNewBlazeRod(playerlocation);
        return;
    }

    // redstone dust goes in the 2nd inventory slot
    var redstoneCost = 64;
    if (playerinventory[1] === null) {
        echo(player, 'fashioning a wand requires ' + redstoneCost + ' redstone dust in your 2nd inventory slot');
        dropNewBlazeRod(playerlocation);
        return;
    }
    if (playerinventory[1].getType() != org.bukkit.Material.REDSTONE) {
        echo(player, 'fashioning a wand requires ' + redstoneCost + ' redstone dust in your 2nd inventory slot');
        dropNewBlazeRod(playerlocation);
        return;
    }
    if (playerinventory[1].getAmount() < redstoneCost) {
        echo(player, 'fashioning a wand requires ' + redstoneCost + ' redstone dust in your 2nd inventory slot');
        dropNewBlazeRod(playerlocation);
        return;
    }

    // the spell reagent goes in the 3rd inventory slot
    var reagentCost = 32;
    if (playerinventory[2] === null) {
        echo(player, 'fashioning a wand requires ' + reagentCost + ' reagent in your 3rd inventory slot');
        dropNewBlazeRod(playerlocation);
        return;
    }
    var indx;
    var wandIndx;
    var wandList = Object.getOwnPropertyNames(wizardwands);
    var wandQty = wandList.length;
    for (indx = 0; indx < wandQty; indx++) {
        if (playerinventory[2].getType() == wizardwands[wandList[indx]].reagent) {
            wandIndx = indx;
        }
    }
    if (wandIndx === undefined) {
        echo(player, 'fashioning a wand requires an appropriate reagent in your 3rd inventory slot');
        dropNewBlazeRod(playerlocation);
        return;
    }
    if (playerinventory[2].getAmount() < reagentCost) {
        echo(player, 'fashioning a wand requires ' + reagentCost + ' reagent in your 3rd inventory slot');
        dropNewBlazeRod(playerlocation);
        return;
    }

    // fashion the wand as a new blaze rod bearing a wand name
    var wandStack = new Packages.org.bukkit.inventory.ItemStack(org.bukkit.Material.BLAZE_ROD);
    var wandMeta = wandStack.getItemMeta();
    wandMeta.setDisplayName(wizardwands[wandList[wandIndx]].name);
    wandStack.setItemMeta(wandMeta);
    // drop it into the world right where the player is, for immediate pick-up
    var wandItem = playerworld.dropItem(playerlocation, wandStack);

    // consume the lapis lazuli, redstone dust, and reagent
    playerinventory[0].setAmount(playerinventory[0].getAmount() - lapisCost);
    playerinventory[1].setAmount(playerinventory[1].getAmount() - redstoneCost);
    playerinventory[2].setAmount(playerinventory[2].getAmount() - reagentCost);

    // consume the blaze rod provided for fashioning the wand
    enchitem.setAmount(0);
}

function dropNewBlazeRod(playerlocation) {
    var wandStack = new Packages.org.bukkit.inventory.ItemStack(org.bukkit.Material.BLAZE_ROD);
    var wandItem = playerlocation.world.dropItem(playerlocation, wandStack);
}

function useWand(event) {
    var useitem = event.getItem();
    if (useitem == null) {
        return;
    }
    if (useitem.getType() != org.bukkit.Material.BLAZE_ROD) {
        return;
    }
    if (event.getAction() != org.bukkit.event.block.Action.LEFT_CLICK_AIR) {
        return;
    }

    var player = event.getPlayer();
    var wandStack = useitem;
    var wandMeta = wandStack.getItemMeta();
    var wandName = wandMeta.getDisplayName();

    var indx = 0;
    var wandList = Object.getOwnPropertyNames(wizardwands);
    var wandQty = wandList.length;

    for (indx = 0; indx < wandQty; indx++) {
        if (wizardwands[wandList[indx]].name == wandName) {
            wizardwands[wandList[indx]].spellfunc(player);
        }
    }
}

// listen for PrepareItemEnchant events, in order to step in and create the spellbooks or wands
events.prepareItemEnchant(grantSpellbook);
events.prepareItemEnchant(fashionWand);

// listen for PlayerInteract events, in order to step in and cast the spell from the wand
events.playerInteract(useWand);

// the /jsp commands for creating / granting the spellbooks
//
// we have these as /jsp commands for flexibility in issuing them; e.g., they are mainly
// used by the above event handling, but this also lets an Op grant a player the
// spellbooks ad-hoc;  see above note in the event listener method asking whether or not
// this is the best way to accomplish this in a DRY manner
//
command('enchantmentsbook', function(parameters, player) {

    //
    // gratefully, the ScriptCraft API has a slash() function for issuing general Minecraft
    // commands; the BookMeta.addPage() (and related) functions turn the input string into a
    // literal 'text' element of a page, eliminating the opportunity to use Minecraft's richer
    // textual spec, which includes things like formatting, click handling, etc
    //
    // BookMeta.Spigot.addPage() (and related) are initialy more promising, but seem to require
    // NMS methods to properly compose / encode the net.md_5.bungee.api.chat.BaseComponent
    // object that these functions operate on
    //
    // thus, we use the work-around of issuing a /give command to supply the player with a
    // spellbook of clickable text for casting the enchantments defined in this plugin
    //
    // (if others can figure out or have figured out a way to do this with only ScriptCraft API
    // and Bukkit/Spigot API calls, insights and feedback are welcome)
    //

    var command = '';
    command  = 'give ' + player.name + ' minecraft:written_book 1 0 {';
    command += 'author:"Crimson Mage",';
    command += 'title:"Weapon and Tool Enchantments",';
    command += 'pages:[';
    // page 1
    command +=       '"{text:\\\"Enchantments\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Use these spells to cast specific enchantments with an item, lapis lazuli, redstone blocks, and reagents in your first few inventory slots; XP levels can substitute for redstone.\\\"}]}",';
    // page 2
    command +=       '"{text:\\\"Helm and Boots\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Respiration I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem respiration 1\\\"},';
    command += 'extra:[{text:\\\"Respiration II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem respiration 2\\\"},';
    command += 'extra:[{text:\\\"Respiration III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem respiration 3\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Depth Strider I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem depthstrider 1\\\"},';
    command += 'extra:[{text:\\\"Depth Strider II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem depthstrider 2\\\"},';
    command += 'extra:[{text:\\\"Depth Strider III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem depthstrider 3\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Frostwalker I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem frostwalker 1\\\"},';
    command += 'extra:[{text:\\\"Frostwalker II\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem frostwalker 2\\\"}}]}]}]}]}]}]}]}]}]}]}",';
    // page 3
    command +=       '"{text:\\\"Pick Axe\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Mending I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem mendingpickaxe 1\\\"},';
    command += 'extra:[{text:\\\"Silk Touch I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem silktouch 1\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Fortune I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem fortune 1\\\"},';
    command += 'extra:[{text:\\\"Fortune II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem fortune 2\\\"},';
    command += 'extra:[{text:\\\"Fortune III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem fortune 3\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Efficiency I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem efficiency 1\\\"},';
    command += 'extra:[{text:\\\"Efficiency II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem efficiency 2\\\"},';
    command += 'extra:[{text:\\\"Efficiency III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem efficiency 3\\\"},';
    command += 'extra:[{text:\\\"Efficiency IV\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem efficiency 4\\\"},';
    command += 'extra:[{text:\\\"Efficiency V\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem efficiency 5\\\"}}]}]}]}]}]}]}]}]}]}]}]}]}",';
    // page 4
    command +=       '"{text:\\\"Armor\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Feather Falling I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem featherfalling 1\\\"},';
    command += 'extra:[{text:\\\"Feather Falling II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem featherfalling 2\\\"},';
    command += 'extra:[{text:\\\"Feather Falling III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem featherfalling 3\\\"},';
    command += 'extra:[{text:\\\"Feather Falling IV\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem featherfalling 4\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Protection I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem protection 1\\\"},';
    command += 'extra:[{text:\\\"Protection II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem protection 2\\\"},';
    command += 'extra:[{text:\\\"Protection III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem protection 3\\\"},';
    command += 'extra:[{text:\\\"Protection IV\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem protection 4\\\"}}]}]}]}]}]}]}]}]}]}",';
    // page 5
    command +=       '"{text:\\\"Crimson Sword\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Mending I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem mendingsword 1\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Vorbal Blade I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem vorpalblade 1\\\"},';
    command += 'extra:[{text:\\\"Vorbal Blade II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem vorpalblade 2\\\"},';
    command += 'extra:[{text:\\\"Vorbal Blade III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem vorpalblade 3\\\"},';
    command += 'extra:[{text:\\\"Vorbal Blade IV\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem vorpalblade 4\\\"},';
    command += 'extra:[{text:\\\"Vorbal Blade V\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem vorpalblade 5\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Flaming Sword I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem flamingsword 1\\\"},';
    command += 'extra:[{text:\\\"Flaming Sword II\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem flamingsword 2\\\"}}]}]}]}]}]}]}]}]}]}]}",';
    // page 6
    command +=       '"{text:\\\"Crimson Bow\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Power I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem power 1\\\"},';
    command += 'extra:[{text:\\\"Power II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem power 2\\\"},';
    command += 'extra:[{text:\\\"Power III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem power 3\\\"},';
    command += 'extra:[{text:\\\"Power IV\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem power 4\\\"},';
    command += 'extra:[{text:\\\"Power V\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem power 5\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Flaming Arrows\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem flamingarrows 1\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Infinity Bow\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem infinitybow 1\\\"}}]}]}]}]}]}]}]}]}]}",';
    // page 7
    command +=       '"{text:\\\"Unbreaking\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Unbreaking Pickaxe I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingpickaxe 1\\\"},';
    command += 'extra:[{text:\\\"Unbreaking Pickaxe II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingpickaxe 2\\\"},';
    command += 'extra:[{text:\\\"Unbreaking Pickaxe III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingpickaxe 3\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Unbreaking Sword I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingsword 1\\\"},';
    command += 'extra:[{text:\\\"Unbreaking Sword II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingsword 2\\\"},';
    command += 'extra:[{text:\\\"Unbreaking Sword III\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingsword 3\\\"}}]}]}]}]}]}]}]}"';
    // end of pages array
    command += ']}';

    slash(command);
});

command('wizardrybook', function(parameters, player) {
    var command = '';
    command  = 'give ' + player.name + ' minecraft:written_book 1 0 {';
    command += 'author:"Crimson Mage",';
    command += 'title:"Wizardry and Spellcasting",';
    command += 'pages:[';
    // page 1
    command +=       '"{text:\\\"Wizard Spells\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Use this book to cast various spells with lapis lazuli, redstone dust, and reagents in your immediate inventory\\\"}]}",';
    // page 2
    command +=       '"{text:\\\"Effects\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Jump\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell jump\\\"},';
    command += 'extra:[{text:\\\"Speed\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell speed\\\"},';
    command += 'extra:[{text:\\\"Strength\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell strength\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Water Breathing\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell waterbreathing\\\"},';
    command += 'extra:[{text:\\\"Night Vision\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell nightvision\\\"},';
    command += 'extra:[{text:\\\"Invisibilty\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell invisibility\\\"}}]}]}]}]}]}]}]}]}",';
    // page 3
    command +=       '"{text:\\\"Defense\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Sustenance\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell sustenance\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Protection\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell protection\\\"},';
    command += 'extra:[{text:\\\"Healing\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell healing\\\"},';
    command += 'extra:[{text:\\\"Healing Aura\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell healingaura\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Regeneration\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell regeneration\\\"}}]}]}]}]}]}]}]}]}"';
    // end of pages array
    command += ']}';

    slash(command);
});

// this can be used to reset the granting of the spellbooks, in case a player
// drops one in some lava or something unfortunate like that
//
command('clearspellbooks', function(parameters, player) {
    var hasplayer = store.players[player.name];

    if (!hasplayer) {
        store.players[player.name] = {};
    }

    store.players[player.name].enchantments = false;
    store.players[player.name].wizardry = false;
});


//////////////////////////////////////////////////////////////////////////////
//  utility functions
//////////////////////////////////////////////////////////////////////////////

// https://codereview.stackexchange.com/questions/13046/javascript-repeat-a-function-x-times-at-i-intervals
//
function repeatwithdelay(callback, interval, repeats, immediate) {
    var timer, trigger;
    trigger = function () {
        callback();
        --repeats || clearInterval(timer);
    };

    interval = interval <= 0 ? 1000 : interval; // default: 1000ms
    repeats  = parseInt(repeats, 10) || 1;      // default: just once
    timer    = setInterval(trigger, interval);

    if( !!immediate ) { // Coerce boolean
        trigger();
    }
}
