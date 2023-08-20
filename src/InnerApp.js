import './App.css';
import './fonts.css';
import React, { Component } from 'react';
import axios from "axios";

class InnerApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemons: [],
            next: null,
            previous: null,
            modalPokemon: false,
            currentPokemon: [],
            isFavs: props.isFavs,
            user: props.user,
            token: props.token,
            currentPokemonFavorite: null,
            favs: []
        };
    }
    componentDidMount() {
        axios.get('https://pokeapi.co/api/v2/pokemon').then(async (response) => {
            let next = response.data.next;
            let previous = response.data.previous;
            let results = response.data.results;
            let updatedPokemons = [];
            for (let index = 0; index < results.length; index++) {
                try {
                    const pokemonResponse = await axios.get(results[index].url);
                    updatedPokemons[index] = pokemonResponse.data;
                } catch (error) {
                    console.error('Error fetching Pokémon:', error);
                }
            }
            this.setState({pokemons: updatedPokemons, next: next, previous: previous}, ()=> {
            });
        });
    }
    componentDidUpdate(prevProps) {
        if(prevProps.isFavs !== this.props.isFavs || prevProps.user !== this.props.user || prevProps.token !== this.props.token){
            this.setState({isFavs: this.props.isFavs,user: this.props.user,token: this.props.token})
        }
        if(prevProps.isFavs !== this.props.isFavs || prevProps.user !== this.props.user || prevProps.token !== this.props.token){
            if(this.props.token !== null){
                let token = this.props.token; 
                axios.get('http://54.236.255.171/api/auth/favorite/myFavs',{headers: {Authorization: `Bearer ${token}`}}).then((response) => {
                    this.setState({favs: response.data.response});
                }).catch ((error) => {
                    console.log(error);
                });
            }
        }
    }
    nextPage = () => {
        let next = this.state.next;
        axios.get(next).then(async (response) => {
            let next = response.data.next;
            let previous = response.data.previous;
            let results = response.data.results;
            let updatedPokemons = [];
            for (let index = 0; index < results.length; index++) {
            try {
                const pokemonResponse = await axios.get(results[index].url);
                updatedPokemons[index] = pokemonResponse.data;
            } catch (error) {
                console.error('Error fetching Pokémon:', error);
            }
            }
            this.setState({pokemons: updatedPokemons, next: next, previous: previous}, ()=> {
            });
        });
    }
    previousPage = () => {
        let previous = this.state.previous;
        axios.get(previous).then(async (response) => {
            let next = response.data.next;
            let previous = response.data.previous;
            let results = response.data.results;
            let updatedPokemons = [];
            for (let index = 0; index < results.length; index++) {
            try {
                const pokemonResponse = await axios.get(results[index].url);
                updatedPokemons[index] = pokemonResponse.data;
            } catch (error) {
                console.error('Error fetching Pokémon:', error);
            }
            }
            this.setState({pokemons: updatedPokemons, next: next, previous: previous}, ()=> {
            });
        });
    }
    openModalPokemon = (pokemon) => {
        const favorite = this.state.favs.find((fav) => fav.ref_api === pokemon.id.toString());
        this.setState({modalPokemon: true, currentPokemon: pokemon, currentPokemonFavorite: favorite});
    }
    closeModalPokemon = () => {
        this.setState({modalPokemon: false, currentPokemon: [], currentPokemonFavorite: null});
    }
    addFav = (pokemon) => {
        let fav = {
            user_id: this.state.user.id,
            ref_api: pokemon.id
        }
        axios.post('http://54.236.255.171/api/auth/favorite/create', fav).then(async (response) => {
            let token = this.state.token;
            axios.get('http://54.236.255.171/api/auth/favorite/myFavs',{headers: {Authorization: `Bearer ${token}`}}).then((response) => {
                this.setState({favs: response.data.response});
                this.closeModalPokemon();
            }).catch ((error) => {
                console.log(error);
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }
    removeFav = (favorite) => {
        let favid = favorite.id; 
        axios.delete(`http://54.236.255.171/api/auth/favorite/delete${favid}`).then(async (response) => {
            let token = this.state.token;
            axios.get('http://54.236.255.171/api/auth/favorite/myFavs',{headers: {Authorization: `Bearer ${token}`}}).then((response) => {
                this.setState({favs: response.data.response});
                this.closeModalPokemon();
            }).catch ((error) => {
                console.log(error);
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }
    loadFavs = () => {
        if(this.props.token !== null){
            let token = this.props.token; 
            axios.get('http://54.236.255.171/api/auth/favorite/myFavs',{headers: {Authorization: `Bearer ${token}`}}).then(async (response) => {
                this.setState({favs: response.data.response});
                let favs = response.data.response;
                let updatedPokemons = [];
                for (let index = 0; index < favs.length; index++) {
                    try {
                        let ref_api = favs[index].ref_api;
                        const pokemonResponse = await axios.get('https://pokeapi.co/api/v2/pokemon/'+ref_api+'/');
                        updatedPokemons[index] = pokemonResponse.data;
                    } catch (error) {
                        console.error('Error fetching Pokémon:', error);
                    }
                }
                this.setState({pokemons: updatedPokemons, next: null, previous: null});
            }).catch ((error) => {
                console.log(error);
            });
        }
    }
    loadAll = () => {
        axios.get('https://pokeapi.co/api/v2/pokemon').then(async (response) => {
            let next = response.data.next;
            let previous = response.data.previous;
            let results = response.data.results;
            let updatedPokemons = [];
            for (let index = 0; index < results.length; index++) {
                try {
                    const pokemonResponse = await axios.get(results[index].url);
                    updatedPokemons[index] = pokemonResponse.data;
                } catch (error) {
                    console.error('Error fetching Pokémon:', error);
                }
            }
            this.setState({pokemons: updatedPokemons, next: next, previous: previous}, ()=> {
            });
        });
        if(this.props.token !== null){
            let token = this.props.token; 
            axios.get('http://54.236.255.171/api/auth/favorite/myFavs',{headers: {Authorization: `Bearer ${token}`}}).then((response) => {
                this.setState({favs: response.data.response});
            }).catch ((error) => {
                console.log(error);
            });
        }
    }
    render() {
        const listItems = this.state.pokemons.map((pokemon) => {
            const favorite = this.state.favs.find((fav) => fav.ref_api === pokemon.id.toString());

            return (
                <div className='poketag-container' key={pokemon.id}>
                <div className='pokemon-name'>
                    <div className='red'></div>
                    <span>{pokemon.name}</span>
                    <div className='red'></div>
                </div>
                <div className='pokemon-photo' onClick={() => this.openModalPokemon(pokemon)}>
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    {this.state.token !== null && (
                    <img
                        src={favorite ? '/icons/heart-filled.png' : '/icons/heart.png'}
                        alt='Fav'
                        id='FavPokeButton'
                    />
                    )}
                </div>
                <div className='pokemon-info'>
                    <div className='red'></div>
                    <div className='stats'>
                    <span>Types: {pokemon.types.map((type, index) => <span key={index}>{index > 0 && ', '}{type.type.name}</span>)}</span>
                    <br></br>
                    <span>Weight: {pokemon.weight}</span>
                    </div>
                    <div className='red'></div>
                </div>
                </div>
            );
        });
        return (
            <div className='inner-app'>
            <div></div>
            <div className="pokemons-container">
                {listItems}
            </div>
            <div></div>
    
            <div></div>
            <div className='Pagginbutttons'>
                {this.state.previous !== null && <div className='PagginButton'><img src='/icons/arrow-left.png' alt='Previous Page' onClick={() => this.previousPage()}></img></div>}
                {this.state.next !== null && <div className='PagginButton'><img src="/icons/arrow-right.png" alt='Next Page' onClick={() => this.nextPage()}></img></div>}
            </div>
            <div></div>
    
            {this.state.modalPokemon && (
                <div className='modal'>
                <div className='ModalPokemon'>
                    <div className='SideContainer'>
                    <div className='pokemon-name'>
                        <div className='red'></div>
                        <span>{this.state.currentPokemon.name}</span>
                        <div className='red'></div>
                    </div>
                    <div className='pokemon-photo'><img src={this.state.currentPokemon.sprites.front_default} alt={this.state.currentPokemon.name}></img></div>
                    <div className='ButtonsContainer'>
                        <div className='button-container-stats'>
                            <img src='/icons/cross.png' alt='Close' width='50' height='50' className='Button' onClick={()=> this.closeModalPokemon()}></img>
                            <span>Close</span>
                        </div>
                        {(this.state.token !== null && this.state.currentPokemonFavorite !== null && this.state.currentPokemonFavorite !== undefined) &&
                            <div className='button-container-stats' onClick={() => this.removeFav(this.state.currentPokemonFavorite)}>
                                <img src='/icons/heart-filled.png' alt='Remove Fav' width='50' className='Button'></img>
                                <span>Remove Fav</span>
                            </div>
                        }
                        {this.state.token !== null && (this.state.currentPokemonFavorite === null || this.state.currentPokemonFavorite === undefined) &&
                            <div className='button-container-stats' onClick={() => this.addFav(this.state.currentPokemon)}>
                                <img src='/icons/heart.png' alt='Add Fav' width='50' className='Button'></img>
                                <span>Add Fav</span>
                            </div>
                        }
                    </div>
                    </div>
                    <div className='SideContainer'>
                    <div className='pokemon-info'>
                        <div className='red'></div>
                        <div className="infoContainer">
                        <span><b>Abilities:</b> {this.state.currentPokemon.abilities.map((ability,index) => <span key={index}>{index > 0 && ', '}{ability.ability.name}</span>)}</span>
                        <br></br>
                        <span><b>Base experience:</b> {this.state.currentPokemon.base_experience}</span>
                        <br></br>
                        <span><b>Height:</b> {this.state.currentPokemon.height}</span>
                        <br></br>
                        <span><b>Base stats:</b></span>
                        <br></br>
                        <div className='statsContainer'>
                            <table className='stats'>
                            <tbody>
                                {this.state.currentPokemon.stats.map((stat,index) => <tr key={index}><td>{stat.stat.name}</td><td>{stat.base_stat}</td></tr>)}
                            </tbody>
                            </table>
                        </div>
                        <br></br>
                        <span><b>Types:</b> {this.state.currentPokemon.types.map((type,index) => <span key={index}>{index > 0 && ', '}{type.type.name}</span>)}</span>
                        <br></br>
                        </div>
                        <div className='red'></div>
                    </div>
                    </div>
                </div>
                </div>
            )}
            </div>
        );
        }
    }

    export default InnerApp;