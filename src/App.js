import React, { Component } from "react";
import Groups from "./Groups";
import Form from "./Form";

class App extends Component {
  state = {
    characters: [],
    groups: [],
  };

  

  componentDidMount() {
    var data = {
      userID: "geoff"
    }

    fetch('https://0ikcn1wb5l.execute-api.eu-west-1.amazonaws.com/dev/groups/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'applications/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then(booksList => {
        this.setState({ groups: booksList });
    });
  }

  render() {
    const { characters } = this.state;
    return (
      <div className="App">
        <h1>Hello, MyApp!</h1>
        <Groups data={this.state.groups}/>
      </div>
    );
  }

  removeCharacter = (index) => {
    const { characters } = this.state;
    this.setState({
      characters: characters.filter((character, i) => {
        return i !== index;
      }),
    });
  };

  handleSubmit = (character) => {
    this.setState({characters: [...this.state.characters, character]})
  }

}

export default App;
