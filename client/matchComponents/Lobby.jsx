/**
 * @file Manages the lobby component.
 */

import React from 'react';
import { Link, withRouter } from 'react-router';
import $ from 'jquery';
import Challenges from './Challenges.jsx';
import Players from './Players.jsx';
import Util from './../util.js';
import GameHistory from './GameHistory.jsx';

/**
 * Creates a new Lobby component.
 * @class
 */

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.refreshChallenges = this.refreshChallenges.bind(this);
    this.state = {
      players: [],
      challenges: [],
      highScore: 0,
      gameHistory: [],
    };
  }

  /** componentWillMount() is invoked immediately before mounting occurs. This one checks for a valid session token and if the token is valid and the user plays a single player game, it makes a random game board for the user. If player is playing challenge mode, it will retrieve the appropriate board */
  componentWillMount() {
    const token = Util.getToken();

    if (!token) {
      this.props.router.push('/signin');
    } else {
      /** Get all users */
      $.get({
        url: '/api/getAllUsers',
        headers: { 'x-access-token': Util.getToken() },
        dataType: 'json',
        success: (data) => {
          this.setState({
            players: data.allUsers,
          });
        },
        error: (data) => {
          console.log('Error!');
          console.log(data);
        },
      });

      /** Get highest score of currently signed in user */
      $.get({
        url: '/api/getHighScore',
        headers: { 'x-access-token': token },
        dataType: 'json',
        success: (data) => {
          this.setState({
            highScore: data.highestScore,
          });
        },
        error: (data) => {
          console.log('Error!');
          console.log(data);
        },
      });

      /** Get all pending game challenges */
      $.get({
        url: '/api/getPendingGames',
        headers: { 'x-access-token': token },
        dataType: 'json',
        success: (data) => {
          this.setState({
            challenges: data.result,
          });
        },
        error: (data) => {
          console.log('Error!');
          console.log(data);
        },
      });

      /** Get all game history */
      $.get({
        url: '/api/getGameHistory',
        headers: { 'x-access-token': token },
        dataType: 'json',
        success: (data) => {
          /** Only display scores above 0 and sort from highest to smallest */
          let gamesAboveZero = data.games.filter((game) => game[0].points > 0).sort(function (a, b) {
            return b[0].points-a[0].points;
          });

          this.setState({
            gameHistory: gamesAboveZero,
          });
        },
        error: (data) => {
          console.log('Error!');
          console.log(data);
        },
      });
    }
  }

  /** This function logs out the current user and destroys the session token.
 */
  logOut() {
    window.localStorage.removeItem('com.hackerwords');
    this.props.router.push('/signin');
  }

  refreshChallenges() {
  $.get({
        url: '/api/getGameHistory',
        headers: { 'x-access-token': Util.getToken() },
        dataType: 'json',
        success: (data) => {

          /** Only display scores above 0 and sort from highest to smallest */

          let gamesAboveZero = data.games.filter((game) => game[0].points > 0).sort(function (a, b) {
            return b[0].points-a[0].points;
          });

          this.setState({
            gameHistory: gamesAboveZero,
          });
        },
        error: (data) => {
          console.log('Error!');
          console.log(data);
        },
      });
  }

  render() {
    return (
      <div className="lobby">
        <h1>Lobby</h1>
        <Link to="/solo"> Single Player </Link>
        <Challenges entries={this.state.challenges} />
        <button className="refreshChallenges" onClick={this.refreshChallenges}> Refresh Challenges </button>
        <Players entries={this.state.players} />
        <div> <h2> Your High Score: {this.state.highScore} </h2> </div>
        <button className="signoutButton" onClick={this.logOut}> Sign Out </button>
        <GameHistory entries={this.state.gameHistory} />
      </div>
    );
  }
}

export default withRouter(Lobby, { withRef: true });
