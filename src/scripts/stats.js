function Stats() {

    this.Active = false;
    this.AvgPlayingTimePerTurn = 0;
    this.NumOfOneCardOnly = 0;
    this.NumOfTurns = 0;
    var s_TimePlaying = 0; // your turn only
    this.IntervalTimerId=0;

    this.timePlayingCounter = function() {
        s_TimePlaying += 1;
    }

    this.init = function () {

        this.Active = false;
        this.AvgPlayingTimePerTurn = 0;
        this.NumOfOneCardOnly = 0;
        this.NumOfTurns = 0;
        s_TimePlaying = 0;
        this.IntervalTimerId = 0;
    };

    this.startTurnTimer = function () {
        if(!this.Active) {
            this.Active = true;
            this.IntervalTimerId = setInterval(this.timePlayingCounter, 1000);
        }
    };

    this.endTurnTimer = function () {
        if(this.Active) {
            this.Active = false;
            clearInterval(this.IntervalTimerId);
            this.NumOfTurns++;
        }
    };

    this.incrementNumOfOneCard= function(){
        this.NumOfOneCardOnly++;
    };

    this.getAvgPlayTime = function () {
        this.AvgPlayingTimePerTurn = s_TimePlaying / this.NumOfTurns;
        if(isNaN(this.AvgPlayingTimePerTurn))
        {
            this.AvgPlayingTimePerTurn=0;
        }
        else if(this.NumOfTurns==0) // avoid infinity
        {
            return 0;
        }
        return this.AvgPlayingTimePerTurn.toFixed(1);
    };

    this.getNumOfTurns = function(){
        return this.NumOfTurns;
    }

    this.getNumOfOneCard = function(){
        return this.NumOfOneCardOnly;
    }
}

//export {Stats};

module.exports = Stats;