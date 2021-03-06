import React, { Component } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

// const SERVER_URL = 'http://localhost:3000/search.json';
const SERVER_URL = 'https://pee-poo-rails.herokuapp.com/search.json';
const LOCATION_URL = 'https://pee-poo-rails.herokuapp.com/locations/';

class Search extends Component {
  constructor() {
    super();
    this.state = {
      results: [],
      suburb: '',
      toilet: 0,
      bath: 0,
      shower: 0,
      baby: 0
    };
    this.fetchSerchForm = this.fetchSerchForm.bind(this);
  }

  fetchSerchForm(suburb, toilet, bath, shower, baby) {
      this.setState({
        results: [],
        suburb: suburb,
        toilet: toilet,
        bath: bath,
        shower: shower,
        baby: baby
      });

      let resultsArray = [];
      axios.get(SERVER_URL, {params: {toilet: toilet, bath: bath, shower: shower, baby: baby, suburb: suburb}}).then((result) =>{
        result.data.map( (r) => {
          let resultObject = {amenity: r};
          let location = LOCATION_URL + r.location_id + '.json';
          axios.get(location).then( (res) => {
            console.log(res.data);
            resultObject.location = res.data;
          });
          resultsArray.push(resultObject);
        });
        this.setState({results: resultsArray});
      });
    }

  render() {
    return (
      <div>
        <Navbar />
        <SearchForm onSubmit={ this.fetchSerchForm } />
        <SearchResults results= { this.state.results } />
      </div>
    );
  }
}

class SearchForm extends Component {
  constructor() {
    super();
    this.state = { suburb: '', toilet: 0, bath: 0, shower: 0, baby: 0 };
    this._handleInputSuburb = this._handleInputSuburb.bind(this);
    this._handleInputToilet = this._handleInputToilet.bind(this);
    this._handleInputBath = this._handleInputBath.bind(this);
    this._handleInputShower = this._handleInputShower.bind(this);
    this._handleInputBaby = this._handleInputBaby.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleInputSuburb(event) {
    this.setState({suburb: event.target.value});
  }

  _handleInputToilet(event) {
    event.target.checked === true ? this.setState({toilet: 1}) : this.setState({toilet: 0});
  }

  _handleInputBath(event) {
    event.target.checked === true ? this.setState({bath: 1}) : this.setState({bath: 0});
  }

  _handleInputShower(event) {
    event.target.checked === true ? this.setState({shower: 1}) : this.setState({shower: 0});
  }

  _handleInputBaby(event) {
    event.target.checked === true ? this.setState({baby: 1}) : this.setState({baby: 0});
  }

  _handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit( this.state.suburb, this.state.toilet, this.state.bath, this.state.shower, this.state.baby );
  }

  render() {
    return (
      <div>
      <h1> Search Amenities...</h1>
      <form onSubmit={ this._handleSubmit }>
         <br/>
        Suburb: <input type="search" placeholder="Sydney" required onInput={ this._handleInputSuburb } />
        Toilet: <input type="checkbox" onInput={ this._handleInputToilet } />
        Bath: <input type="checkbox" onInput={ this._handleInputBath } />
        Shower: <input type="checkbox" onInput={ this._handleInputShower } />
        Baby: <input type="checkbox" onInput={ this._handleInputBaby } />
        <input type="submit" value="Search" />
      </form>
      </div>
    );
  }
}

class SearchResults extends Component {
  render() {
    console.log(this.props.results);
    return(
      <div className="container">
        {this.props.results.map( (r) =>
          <div key={r.amenity.id}>
            <p>Rating: {r.amenity.rating}</p>
            <p>Price: ${r.amenity.price} per 10mins</p>
            <p>Type Of House: {r.amenity.typeOfHouse}</p>
            <p><a href={"#/search/" + r.amenity.id}>More Details >>></a></p>
            <p><img src={r.amenity.image} /></p>
          </div>
       )}
      </div>
    )
  }
}

export default Search;
