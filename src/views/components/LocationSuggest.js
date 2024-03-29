import {Component} from 'react'
import Autosuggest from 'react-autosuggest';
import querystring from 'querystring'

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const params = querystring.stringify({
    format: 'json',
    limit: 5,
    countrycodes: 'us',
    addressdetails: 1,
    namedetails: 1,
    q: inputValue
  })
  const searchUrl = `https://nominatim.openstreetmap.org/search?${params}`
  console.log(searchUrl)
  return fetch(searchUrl)
  .then(res => res.json())
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.display_name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div> {suggestion.display_name} </div>
);

const renderInputComponent = inputProps => (
  <input name='location' {...inputProps} />
);

class LocationSuggest extends Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    getSuggestions(value)
    .then(suggestions => {
      this.setState({suggestions});
    })
    
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type an address, business, park, etc',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderInputComponent}
        inputProps={inputProps}
        theme={ {input: 'input'} }
      />
    );
  }
}

module.exports = LocationSuggest