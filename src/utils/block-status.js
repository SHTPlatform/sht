var constants = require('./constants.js');

function BlockStatus() {
  var milestones = [
    0, 0, 0, 0, 0
    // 3.5 * 100000000, // Initial Reward
    // 3.0 * 100000000, // Milestone 1
    // 2.0 * 100000000, // Milestone 2
    // 1.0 * 100000000, // Milestone 3
    // 0.5 * 100000000  // Milestone 4
  ];

  var distance = 3000000, // Distance between each milestone
    rewardOffset = 999999999999; // Start rewards at block (n)

  // if (global.Config.netVersion === 'mainnet') {
  //   rewardOffset = 500000;
  // }

  var parseHeight = function (height) {
    height = parseInt(height);
    if (isNaN(height)) {
      throw new Error('Invalid block height');
    } else {
      return Math.abs(height);
    }
  };

  this.calcMilestone = function (height) {
    var location = Math.floor(parseHeight(height - rewardOffset) / distance),
      lastMile = milestones[milestones.length - 1];

    if (location > (milestones.length - 1)) {
      return milestones.lastIndexOf(lastMile);
    } else {
      return location;
    }
  };

  this.calcReward = function (height) {
    return 0; // 关闭奖励

    var height = parseHeight(height);
    if (height < rewardOffset || height <= 1) {
      return 0;
    } else {
      return milestones[this.calcMilestone(height)];
    }
  };

  this.calcSupply = function (height) {
    // return 0; // 关闭奖励
    var height = parseHeight(height);
    height -= height % 101;
    var milestone = this.calcMilestone(height);
    var supply = constants.totalAmount;
    var rewards = [];

    if (height <= 0) {
      return supply;
    }

    var amount = 0, multiplier = 0;
    height = height - rewardOffset + 1;
    for (var i = 0; i < milestones.length; i++) {
      if (milestone >= i) {
        multiplier = milestones[i];

        if (height <= 0) {
          break; // Rewards not started yet
        } else if (height < distance) {
          amount = height % distance; // Measure distance thus far
        } else {
          amount = distance; // Assign completed milestone
        }
        rewards.push([amount, multiplier]);
        height -= distance; // Deduct from total height
      } else {
        break; // Milestone out of bounds
      }
    }
    if (height > 0) {
      rewards.push([height, milestones[milestones.length - 1]]);
    }

    for (i = 0; i < rewards.length; i++) {
      var reward = rewards[i];
      supply += reward[0] * reward[1];
    }

    if (rewardOffset <= 1) {
      supply -= milestones[0];
    }

    return supply;
  };
}

// Exports
module.exports = BlockStatus;
