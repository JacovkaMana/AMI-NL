# README: Character Management System

This document provides an overview of the classes used in the Character Management System. Each class is designed to represent different aspects of a character in a game, including character classes, features, subclasses, spellcasting, and more. This structured format will help developers understand the data types and relationships between classes for API and frontend development.

## Class Overview

### 1. `CharacterClass`
Represents a character class in the game.

- **Properties:**
  - `name` (String): The name of the class (unique).
  - `description` (String): A description of the class.
  - `hit_die` (Integer): The hit die value for the class.
  - `primary_ability` (String): The primary ability for the class.
  - `saving_throw_proficiencies` (Array): List of saving throw proficiencies.
  - `armor_proficiencies` (Array): List of armor proficiencies.
  - `weapon_proficiencies` (Array): List of weapon proficiencies.
  - `tool_proficiencies` (Array): List of tool proficiencies.
  - `skill_proficiencies` (Array): List of skill proficiencies.

### 2. `ClassFeature`
Represents a feature that a character class or subclass has.

- **Properties:**
  - `name` (String): The name of the feature.
  - `description` (String): A description of the feature.
  - `level_gained` (Integer): The level at which the feature is gained.

### 3. `Subclass`
Represents a subclass that belongs to a character class.

- **Properties:**
  - `name` (String): The name of the subclass.
  - `description` (String): A description of the subclass.
  - `parent_class` (Relationship): A relationship to the parent character class.
  - `features` (Relationship): A relationship to the features that the subclass has.

### 4. `Spellcasting`
Represents the spellcasting ability of a character class or subclass.

- **Properties:**
  - `spellcasting_ability` (String): The ability used for spellcasting.
  - `is_prepared_caster` (Boolean): Indicates whether the caster prepares spells (default: True).
  - `spell_slots_per_level` (JSON): Stores the number of spell slots per level as a JSON object for flexibility.

### 5. `Player`
Represents a player in the game.

- **Properties:**
  - `uid` (UniqueId): Unique identifier for the player.
  - `username` (String): Unique username for the player (max length: 50).
  - `email` (String): Email address of the player (max length: 100).
  - `registration_date` (Date): Date of registration.
  - `characters` (Relationship): Relationship to the characters owned by the player.

### 6. `Item`
Represents an item in the game.

- **Properties:**
  - `uid` (UniqueId): Unique identifier for the item.
  - `name` (String): Name of the item (max length: 50).
  - `description` (String): Description of the item (max length: 200).
  - `cost` (String): Cost of the item.
  - `item_type` (String): Type of the item.
  - `weight` (Float): Weight of the item.
  - `rarity` (String): Rarity of the item.
  - `effects` (Relationship): Relationship to the effects associated with the item.

### 7. `InventoryItem`
Represents an item in a character's inventory.

- **Properties:**
  - `character` (Relationship): Relationship to the character that owns the item.
  - `item` (Relationship): Relationship to the item.
  - `quantity` (Integer): Quantity of the item (default: 1).

### 8. `Skill`
Represents a skill that a character can have.

- **Properties:**
  - `uid` (UniqueId): Unique identifier for the skill.
  - `name` (String): Name of the skill (max length: 50).
  - `proficiency` (Boolean): Indicates if the character is proficient in the skill.
  - `character` (Relationship): Relationship to the character that has the skill.

### 9. `Spell`
Represents a spell that a character can know.

- **Properties:**
  - `uid` (UniqueId): Unique identifier for the spell.
  - `name` (String): Name of the spell (max length: 50).
  - `level` (Integer): Level of the spell.
  - `character` (Relationship): Relationship to the character that knows the spell.

### 10. `CharacterBase`
An abstract base class for characters, including common attributes.

- **Properties:**
  - `strength` (Integer): Strength score (default: 10).
  - `dexterity` (Integer): Dexterity score (default: 10).
  - `constitution` (Integer): Constitution score (default: 10).
  - `intelligence` (Integer): Intelligence score (default: 10).
  - `wisdom` (Integer): Wisdom score (default: 10).
  - `charisma` (Integer): Charisma score (default: 10).
  - `speed` (Integer): Speed of the character (default: 30).
  - `armor_class` (Integer): Armor class of the character.
  - `hit_points` (Integer): Hit points of the character.
  - `initiative_modifier` (Integer): Initiative modifier of the character.
  - `proficient_skills` (Relationship): Relationship to the skills the character is proficient in.
  - `languages` (Relationship): Relationship to the languages the character speaks.
  - `alignment` (String): Character's alignment.
  - `type` (String): Character's type.
  - `size` (String): Character's size.

### 11. `Monster`
Represents a monster in the game, inheriting from `CharacterBase`.

- **Properties:**
  - `challenge_rating` (Float): Challenge rating of the monster.
  - `experience_points` (Integer): Experience points awarded for defeating the monster.

### 12. `Character`
Represents a character in the game.

- **Properties:**
  - `name` (String): Name of the character.
  - `race` (String): Race of the character.
  - `character_class` (Relationship): Relationship to the character's class.
  - `level` (Integer): Level of the character.

## Enums

### 1. `EquipmentSlot`
Defines the equipment slots available.

- **Values:**
  - `HEAD`: "HEAD"
  - `CHEST`: "CHEST"
  - `LEGS`: "LEGS"
  - `FEET`: "FEET"
  - `HANDS`: "HANDS"
  - `RING`: "RING"
  - `NECK`: "NECK"
  - `WAIST`: "WAIST"

### 2. `Attribute`
Defines the attributes available for characters.

- **Values:**
  - `STRENGTH`: "Strength"
  - `DEXTERITY`: "Dexterity"
  - `CONSTITUTION`: "Constitution"
  - `INTELLIGENCE`: "Intelligence"
  - `WISDOM`: "Wisdom"
  - `CHARISMA`: "Charisma"

### 3. `Size`
Defines the sizes available for characters and creatures.

- **Values:**
  - `TINY`: "Tiny"
  - `SMALL`: "Small"
  - `MEDIUM`: "Medium"
  - `LARGE`: "Large"
  - `HUGE`: "Huge"
  - `GARGANTUAN`: "Gargantuan"

### 4. `Type`
Defines the types of creatures available.

- **Values:**
  - `ABERRATION`: "Aberration"
  - `BEAST`: "Beast"
  - `CELESTIAL`: "Celestial"
  - `CONSTRUCT`: "Construct"
  - `DRAGON`: "Dragon"
  - `ELEMENTAL`: "Elemental"
  - `FEY`: "Fey"
  - `FIEND`: "Fiend"
  - `GIANT`: "Giant"
  - `HUMANOID`: "Humanoid"
  - `MONSTROSITY`: "Monstrosity"
  - `OOZE`: "Ooze"
  - `PLANT`: "Plant"
  - `UNDEAD`: "Undead"

### 5. `Alignment`
Defines the alignments available for characters.

- **Values:**
  - `UNALIGNED`: "Unaligned"
  - `LAWFUL_GOOD`: "Lawful Good"
  - `NEUTRAL_GOOD`: "Neutral Good"
  - `CHAOTIC_GOOD`: "Chaotic Good"
  - `LAWFUL_NEUTRAL`: "Lawful Neutral"
  - `TRUE_NEUTRAL`: "True Neutral"
  - `CHAOTIC_NEUTRAL`: "Chaotic Neutral"
  - `LAWFUL_EVIL`: "Lawful Evil"
  - `NEUTRAL_EVIL`: "Neutral Evil"
  - `CHAOTIC_EVIL`: "Chaotic Evil"

### 6. `ArmorType`
Defines the types of armor available.

- **Values:**
  - `NONE`: "None"
  - `LIGHT`: "Light"
  - `MEDIUM`: "Medium"
  - `HEAVY`: "Heavy"
  - `SHIELDS`: "Shields"

### 7. `WeaponType`
Defines the types of weapons available.

- **Values:**
  - `SIMPLE_MELEE`: "Simple Melee"
  - `SIMPLE_RANGED`: "Simple Ranged"
  - `MARTIAL_MELEE`: "Martial Melee"
  - `MARTIAL_RANGED`: "Martial Ranged"

### 8. `ToolType`
Defines the types of tools available.

- **Values:**
  - `ARTISANS_TOOLS`: "Artisan's Tools"
  - `GAMING_SET`: "Gaming Set"
  - `MUSICAL_INSTRUMENT`: "Musical Instrument"
  - `THIEVES_TOOLS`: "Thieves' Tools"
  - `VEHICLES`: "Vehicles"

### 9. `SkillType`
Defines the types of skills available.

- **Values:**
  - `ACROBATICS`: "Acrobatics"
  - `ANIMAL_HANDLING`: "Animal Handling"
  - `ARCANA`: "Arcana"
  - `ATHLETICS`: "Athletics"
  - `DECEPTION`: "Deception"
  - `HISTORY`: "History"
  - `INSIGHT`: "Insight"
  - `INTIMIDATION`: "Intimidation"
  - `INVESTIGATION`: "Investigation"
  - `MEDICINE`: "Medicine"
  - `NATURE`: "Nature"
  - `PERCEPTION`: "Perception"
  - `PERFORMANCE`: "Performance"
  - `PERSUASION`: "Persuasion"
  - `RELIGION`: "Religion"
  - `SLEIGHT_OF_HAND`: "Sleight of Hand"
  - `STEALTH`: "Stealth"
  - `SURVIVAL`: "Survival"

## Conclusion

This README provides a structured overview of the classes used in the Character Management System. Each class is designed to encapsulate specific aspects of character management, making it easier for developers to understand and implement the necessary functionality in both the API and frontend.
