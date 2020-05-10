const downgrades = [
{
  name: 'skipPhase',
  description: 'Skip either your Draw phase or your Action phase.',
  optional: false
},
{
  name: 'disableUnicornEffects',
  description: 'Triggered effects of your Unicorn cards do not activate.',
  optional: false
},
{
  name: 'noUpgrades',
  description: 'You cannot play Upgrade cards.',
  optional: false
},
{
  name: 'discardCard',
  description: 'Discard a card',
  optional: false
},
{
  name: 'returnToHand',
  description: 'Return a Unicorn card',
  optional: false
},
{
  name: 'limitHand',
  description: 'Your hand limit is 3 cards',
  optional: false
},
{
  name: 'horseShit',
  description: 'All of your Unicorn cards are considered Shits. Cards that affect Unicorn cards do not affect Shits.',
  optional: false
},
{
  name: 'stopCard',
  description: 'Stop that player\'s card from being played and send it to the discard pile.',
  optional: false
},
{
  name: 'stopAndDiscard',
  description: 'Stop that player\'s card from being played and send it to the discard pile. That player must DISCARD a card.',
  optional: false
},
{
  name: 'destroyCard',
  description: 'Destroy a card',
  optional: false
},
{
  name: 'discardCards',
  description: 'Discard 2 card',
  optional: false
},
{
  name: 'noMagicCards',
  description: 'Cannot play magic cards',
  optional: false
},
{
  name: 'farSight',
  description: 'See the top 3 cards on deck',
  optional: false
},
];

export default downgrades
