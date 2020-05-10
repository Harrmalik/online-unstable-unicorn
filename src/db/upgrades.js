const upgrades = [
{
  name: 'sacrificeAndDestroy',
  description: 'You may SACRIFICE a card. If you do, DESTROY a card.',
  optional: true
},
{
  name: 'doubleActions',
  description: 'You may play 2 cards during your action phase.',
  optional: true
},
{
  name: 'drawFromPlayer',
  description: 'You may choose any other player. Pull a card from that player\'s hand and add it to your hand. If you do, skip your Draw phase.',
  optional: true
},
{
  name: 'borrowUnicorn',
  description: 'You may STEAL a Unicorn card. At the end of your turn, return that Unicorn card to the Stable from which you stole it.',
  optional: true
},
{
  name: 'drawExtraCard',
  description: 'You may DRAW an extra card.',
  optional: true
},
{
  name: 'swapUnicorns',
  description: 'You may move a Unicorn card from any player\'s Stable to any other player\'s Stable. You cannot move that card into your own Stable.',
  optional: true
},
{
  name: 'basicBitch',
  description: 'You may bring a Basic Unicorn card from your hand directly into your Stable.',
  optional: true
},
{
  name: 'volunteerAsTribute',
  description: 'If 1 of your Unicorns would be sacrificed or destroyed, you may SACRIFICE this card instead.',
  optional: true
},
{
  name: 'unKillable',
  description: 'Your Unicorn cards cannot be destroyed.',
  optional: false
},
{
  name: 'drawBeforeEnding',
  description: 'You may DRAW a card at the end of your turn.',
  optional: true
},
{
  name: 'sacrificeBaby',
  description: 'You may SACRIFICE a Basic Unicorn card. If you do, pull a card from each other player\'s hand and add it to your hand.',
  optional: true
},
{
  name: 'getBabyUnicorn',
  description: 'Bring a Baby Unicorn card from the Nursery directly into your Stable.',
  optional: true
},
{
  name: 'farSight',
  description: 'See the top 3 cards on deck',
  optional: false
},
{
  name: 'findBearDaddy',
  description: 'You may SACRIFICE a card. If you do, DESTROY a card.',
  optional: true
},
{
  name: 'sacrificeBaby',
  description: 'You may SACRIFICE a Basic Unicorn card. If you do, pull a card from each other player\'s hand and add it to your hand.',
  optional: true
},

];

export default upgrades
