import React ,{Component}from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Imagelinkform from './components/Imagelinkform/Imagelinkform';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';
import FaceReco from './components/FaceReco/FaceReco';
import './App.css';


const Backgroundpartiles={
  particles: {
      number:{
        value:150,
        density:{
          enable:true,
          value_area:800
        }
      }
  }
}
const inintialState={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      issignedIn:false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joines:''
      }
    }
class App extends Component {
  constructor(){
    super();
    this.state= inintialState;   
  }
  loadUser=(data)=>{
    this.setState({user:{
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joines:data.joines
    }})
  }

  calculateFacelocation=(data)=>{
    const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    console.log(width,height);
    return{
          leftCol : clarifaiFace.left_col * width,
          topRow : clarifaiFace.top_row * height,
          rightCol : width - (clarifaiFace.right_col * width),
          bottomRow : height - (clarifaiFace.bottom_row * height)
      }
    
  }
  displayFacebox=(box)=>{
    this.setState({box:box});
  }
  oninputchange = (event) => {
    this.setState({input:event.target.value});
  }
  onbuttonsubmit =() =>{
    this.setState({imageUrl:this.state.input})
      fetch('https://calm-oasis-76638.herokuapp.com/imageurl',{
      method:'post',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
      input:this.state.input
        })
    })
    .then(response=>response.json())
    .then(response=>{
      if(response){
        fetch('https://calm-oasis-76638.herokuapp.com/image',{
        method:'put',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
        id:this.state.user.id
        })
    })      
        .then(response=>response.json())
        .then(count=> {
          this.setState(Object.assign(this.state.user,{ entries: count }))
        })
      } 
      this.displayFacebox( this.calculateFacelocation(response))
    })
    .catch(err=>console.log(err));
  }
  onRouteChange=(route)=>{
    if(route==='signout'){
      this.setState(inintialState)
    }else if(route==='home'){
      this.setState({issignedIn:true})
    }
    this.setState({route:route});
  }
  render(){

    return (
      <div className="App">
        <Particles className='particles'
              params={Backgroundpartiles}/>

        <Navigation issignedIn={this.state.issignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route==='home'?
        <div>
            <Logo />
            <Rank 
            name={this.state.user.name}
            entries={this.state.user.entries}
            />
            <Imagelinkform 
            oninputchange={this.oninputchange}
            onbuttonsubmit={this.onbuttonsubmit}
            />
            <FaceReco box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
          :(this.state.route ==='signin'
            ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
          
        }
     </div>
    );
  }  
}

export default App;
