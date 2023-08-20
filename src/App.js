import './App.css';
import './fonts.css';
import React, { Component } from 'react';
import axios from "axios";
import InnerApp from "./InnerApp";
import RandomImage from "./RandomImage";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      token: null,
      modalLogIn: false,
      modalSingUp: false,
      modalProfile: false,
      accessToken: null,
      isFavs: false
    };
    this.name = null
    this.email = null
    this.password = null
    this.rpassword = null
    this.address = null
    this.city = null
    this.birthdate = null
    this.InnerApp = null
  }

  openModalLogIn = () => {
    this.setState({modalLogIn: true});
  }
  closeModalLogIn = () => {
    this.setState({modalLogIn: false});
  }
  LogIn = () => {
    if(this.email.value !== '' && this.password.value !== ''){
      let user = {
        email: this.email.value,
        password: this.password.value
      }
      axios.post('/pokedexapp/api/auth/login/', user).then(async (response) => {
        let accessToken = response.data.access_token;
        axios.post('/pokedexapp/api/auth/me/',{}, {headers: {Authorization: `Bearer ${accessToken}`}}).then(async (response) => {
          let user = response.data;
          alert('Login successfully');
          this.setState({user: user,modalLogIn:false,token:accessToken});
        });
      }).catch((error) => {
        if (error.response.status === 401)
            alert("Incorrect Credentials.");
      });
    } else {
      alert('The email or password fields are empty or incorrect.');
    }
  }
  Logout = () => {
    let accessToken = this.state.token;
    axios.post('/pokedexapp/api/auth/logout/',{}, {headers: {Authorization: `Bearer ${accessToken}`}}).then(async (response) => {
      alert('Logout successfully');
      this.setState({user: null,modalLogIn:false,token:null});
    }).catch((error) => {
      console.log(error);
    });
  }
  validateData = (camps) => {
    for(let i = 0; i<camps.length;i++){
      if(camps[i].value === ''){
        alert('The '+camps[i].name+' field cannot be empty');
        return false;
      }
      if(camps[i].name === 'email'){
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!emailRegex.test(camps[i].value)){
          alert('The e-mail does not comply with the e-mail format.');
          return false;
        }
      }
    }
    return true;
  }
  SingUp = () => {
    let camps = [this.name, this.email, this.password, this.rpassword];
    var validateData = this.validateData(camps);
    if(!validateData){
      return;
    }
    if(this.name.value !== '' && this.email.value !== '' && this.password.value !== '' && this.rpassword.value !== ''){
      if(this.password.value !== this.rpassword.value){
        alert('Passwords do not match');
        return;
      }
      let user = {
        name: this.name.value,
        email: this.email.value,
        password: this.password.value
      }
      axios.post('/pokedexapp/api/auth/register/', user).then(async (response) => {
        let user = {
          email: this.email.value,
          password: this.password.value
        }
        axios.post('/pokedexapp/api/auth/login/', user).then(async (response) => {
          let accessToken = response.data.access_token;
          axios.post('/pokedexapp/api/auth/me/',{}, {headers: {Authorization: `Bearer ${accessToken}`}}).then(async (response) => {
            let user = response.data;
            alert('Successful registration');
            this.setState({user: user,modalSingUp:false,token:accessToken});
          });
        }).catch((error) => {
          if (error.response.status === 401)
              alert("Incorrect Credentials.");
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }
  openModalSingUp = () => {
    this.setState({modalSingUp: true});
  }
  closeModalSingUp = () => {
    this.setState({modalSingUp: false});
  }
  openModalProfile = () => {
    this.setState({modalProfile: true});
  }
  closeModalProfile = () => {
    this.setState({modalProfile: false});
  }
  saveProfile = () => {
    console.log(this.name, this.email, this.address, this.city, this.birthdate)
    let camps = [this.name, this.email, this.address, this.city, this.birthdate]
    var validateData = this.validateData(camps);
    if(!validateData){
      return;
    }
    let user = {
      name: this.name.value,
      email: this.email.value,
      address: this.address.value,
      city: this.city.value,
      birthdate: this.birthdate.value
    }
    let accessToken = this.state.token;
    axios.put('/pokedexapp/api/auth/update/', user, {headers: {Authorization: `Bearer ${accessToken}`}}).then(async (response) => {
        axios.post('/pokedexapp/api/auth/me/',{}, {headers: {Authorization: `Bearer ${accessToken}`}}).then(async (response) => {
          let user = response.data;
          alert('Successful update');
          this.setState({user: user,modalProfile:false,token:accessToken});
        });
      })
      .catch((error) => {
        console.log(error);
    });
  }
  loadFavs = () => {
    this.InnerApp.loadFavs();
    this.setState({isFavs: true});
  }
  loadAll = () => {
    this.InnerApp.loadAll();
    this.setState({isFavs: false});
  }
  render() {
    return (
      <div className="App">
        <div className='header'>
          <h1 className='header-title'>Pokédex App</h1>
          <div></div>
          {this.state.token === null && <div className='button-container' onClick={()=> this.openModalSingUp()}>
            <div className='pokebutton'></div>
            <span>Sing Up</span>
          </div>
          }
          {this.state.token !== null && this.state.isFavs === false && <div className='button-container' onClick={() => this.loadFavs()}>
            <div className='favsbutton'></div>
            <span>Favs</span>
          </div>
          }
          {this.state.token !== null && this.state.isFavs && <div className='button-container' onClick={() => this.loadAll()}>
            <div className='pokebutton'></div>
            <span>All</span>
          </div>
          }
          {this.state.token === null && <div className='button-container' onClick={() => this.openModalLogIn()}>
            <div className='pokebutton'></div>
            <span>Sing In</span>
          </div>
          }
          {this.state.token !== null && <div className='button-container' onClick={() => this.Logout()}>
            <div className='logoutbutton'></div>
            <span>Logout</span>
          </div>
          }
          {this.state.token !== null && 
            <div className='button-container' onClick={() => this.openModalProfile()}>
              <RandomImage></RandomImage>
              <span>Profile</span>
            </div>
          }
        </div>
        <InnerApp isFavs={this.state.isFavs} user={this.state.user} token={this.state.token} ref={(ref) => (this.InnerApp = ref)}/>
        <div className='footer'>
          <p>Hecho por Daniel Monsalve <a href="https://github.com/TuUsuario" target="_blank" rel="noopener noreferrer">GitHub</a></p>
          <p>Desarrollado en React.js, Laravel y PokéAPI</p>
        </div>
        {this.state.modalLogIn && 
          <div className='modal'>
            <div className='ModalLogIn'>
              <input type='email' name='email' placeholder='email' ref={(ref) => (this.email = ref)}></input>
              <input type='password' name='password' placeholder='password' ref={(ref) => (this.password = ref)}></input>
              <div className='LogInButtonsContainer'>
                <div className='closeSingInContainer' onClick={()=> this.closeModalLogIn()}>
                  <div className='closeSingIn'>
                  </div>
                  <span>Close</span>
                </div>
                <div className='pokeSingInContainer' onClick={()=> this.LogIn()}>
                  <div className='pokeSingIn'></div>
                  <span>Sing In</span>
                </div>
              </div>
            </div>
          </div>
        }
        {this.state.modalSingUp && 
          <div className='modal'>
            <div className='ModalLogIn'>
            <input type='text' name='name' placeholder='name' ref={(ref) => (this.name = ref)}></input>
              <input type='email' name='email' placeholder='email' ref={(ref) => (this.email = ref)}></input>
              <input type='password' name='password' placeholder='password' ref={(ref) => (this.password = ref)}></input>
              <input type='password' name='repeat password' placeholder='repeat password' ref={(ref) => (this.rpassword = ref)}></input>
              <div className='LogInButtonsContainer'>
                <div className='closeSingInContainer' onClick={()=> this.closeModalSingUp()}>
                  <div className='closeSingIn'>
                  </div>
                  <span>Close</span>
                </div>
                <div className='pokeSingInContainer' onClick={()=> this.SingUp()}>
                  <div className='pokeSingIn'></div>
                  <span>Sing Up</span>
                </div>
              </div>
            </div>
          </div>
        }
        {this.state.modalProfile && 
          <div className='modal'>
            <div className='ModalLogIn'>
              <input type='text' name='name' placeholder='name' defaultValue={this.state.user.name} ref={(ref) => (this.name = ref)}></input>
              <input type='email' name='email' placeholder='email' defaultValue={this.state.user.email} ref={(ref) => (this.email = ref)}></input>
              <input type='text' name='address' placeholder='address' defaultValue={this.state.user.address} ref={(ref) => (this.address = ref)}></input>
              <input type='text' name='city' placeholder='city' defaultValue={this.state.user.city} ref={(ref) => (this.city = ref)}></input>
              <input type='date' name='birthdate' defaultValue={this.state.user.birthdate} ref={(ref) => (this.birthdate = ref)}></input>

              <div className='LogInButtonsContainer'>
                <div className='closeSingInContainer' onClick={()=> this.closeModalProfile()}>
                  <div className='closeSingIn'>
                  </div>
                  <span>Close</span>
                </div>
                <div className='pokeSingInContainer' onClick={()=> this.saveProfile()}>
                  <div className='pokeSingIn'></div>
                  <span>Save</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
