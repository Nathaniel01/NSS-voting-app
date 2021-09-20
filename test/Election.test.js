const { assert } = require('chai');

const Election = artifacts.require('Election')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Election', (accounts) => {
    let election;

    before(async () => {
        election = await Election.new()
    })

    describe('Election deployment', async() => {
        it('initialises three candidates', async() => {
            const count = await election.candidatesCount();
            assert.equal(count, 3);
        })

        it('initialises the candidates to the correct values', async() => {
            let candidate = await election.candidates(1);          
            assert.equal(candidate[0], 1, "contains the correct ID");
            assert.equal(candidate[1], "Noah's Ark Children's Hospice", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct vote count");

            candidate = await election.candidates(2);
            assert.equal(candidate[0], 2, "contains the correct ID");
            assert.equal(candidate[1], "Mind", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct vote count");

            candidate = await election.candidates(3)
            assert.equal(candidate[0], 3, "contains the correct ID");
            assert.equal(candidate[1], "Homeless Action", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct vote count");            
        })

        it('Allows voters to cast a vote', async() => {
            //candidateID = 1; . For some reason the variable declration isn't working, used the constant instead
            let receipt =  await election.vote(1, {from: accounts[0]})
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), 1, "the candidate id is correct");
            
            let voted = await election.voters(accounts[0])
            assert(voted, "the user was marked as voted");

            let candidate = await election.candidates(1)
            let voteCount = candidate[2];
            assert.equal(voteCount, 1, "increments the candidates votes's count")
        })

        it("throws an exception for invalid candidates", async () => {
           await election.vote(99, { from: accounts[1] }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return election.candidates(1);
          }).then(function(candidate1) {
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
            return election.candidates(2);
          }).then(function(candidate2) {
            var voteCount = candidate2[2];
            assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
          });
        });

        it("throws an exception for double voting", async() =>{
            //CandiddateID =2. Same problem as above.
            await election.vote(2, {from: accounts[1]})
            let candidate = await election.candidates(2)
            var voteCount  = candidate[2];
            assert.equal(voteCount, 1, "accepts first vote")
            
            await election.vote(2, {from: accounts[1]}).then(assert.fail).catch(function(error) {
                assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
                return election.candidates(1);
              }).then(function(candidate1) {
                var voteCount = candidate1[2];
                assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
                return election.candidates(2);
              }).then(function(candidate2) {
                var voteCount = candidate2[2];
                assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
            });
        })
    })
});