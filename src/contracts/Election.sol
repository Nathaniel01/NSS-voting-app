// SPDX-License-Identifier: MIT
pragma solidity >=0.5;

contract Election {
    //Model candidate
    struct Candidates{
        uint id;
        string name;
        uint voteCount;
    }
    
    //Check for candidate vote using kv pairs
    mapping(address => bool) public voters;

    //Key value pair of candidate
    mapping(uint => Candidates) public candidates;

    uint public candidatesCount;

    event votedEvent(
        uint indexed _candidateId
    );

    constructor () public {
        addCandidate("Noah's Ark Children's Hospice");
        addCandidate("Mind");
        addCandidate("Homeless Action");
    }


    //add candidates
    function addCandidate(string memory _name) private{
        candidatesCount++;
        candidates[candidatesCount] = Candidates(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        //require voter to not have voted before
        require(!voters[msg.sender]);

        //require valid candidate by checking candidate id
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        
        //record that voter has voted
        voters[msg.sender] = true;

        //Increment vote count
        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);
    }
}