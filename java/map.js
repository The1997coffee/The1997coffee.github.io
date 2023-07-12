const loc_pasaz = { lat: 5.621878426504218, lng: 100.51150925314587  },
      loc_winchester = { lat: 5.621878426504218, lng: 100.51150925314587 },
      loc_courier = { lat: 5.621878426504218, lng: 100.51150925314587 };
var map,
    directionsService = new google.maps.DirectionsService (),
    directionsRenderer = new google.maps.DirectionsRenderer ({suppressBicyclingLayer: true});

function initMap() {
  console.log('init map');
  map = new google.maps.Map(document.getElementById('map'), { 
    center: loc_winchester,
    zoom: 12
  });
  
  let courier = new Courier(map, loc_courier);
  courier.setDestination(loc_pasaz);
  
  let life = new Life(map, [
    new Restaurant(map, loc_winchester),
    courier
  ]);
  
  life.start();
}

class Life {
  constructor(map, entities = []) {
    this.map = map;
    this.entities = entities;
  }
  
  start() {
    this.timer = setInterval(() => {
      this.entities.forEach((entity) => {
        entity.tick();
      });
      this.render();
    }, 1000);
  }
  
  pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  render() {
    this.entities.forEach((entity) => {
      entity.render(this.map);
    });
  }
}

class Operator {
  constructor() {
    this.tickCount = 0;
  }
  
  tick() {
    console.log('Ticking: ' + this.constructor.name + ' ' + this.tickCount);
    this.tickCount++;
  }
  
  render(map) {
  }
}

class Courier extends Operator {
  constructor(map, location) {
    super();
    this.map = map;
    this.location = location;
    this.marker = new google.maps.Marker({
      map,
      position: this.location,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 3,
        strokeColor: '#29B6F6',
        strokeOpacity: 1,
        strokeWeight: 3,
      },
    });
    this.direction = new google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: '#29B6F6',
      strokeOpacity: 1,
      strokeWeight: 2,
      map: map
    });
  }
  
  tick () {
    super.tick();
    console.log('Courier location: ', this.location);
    
    if (!this.location || !this.destination) {
      return;
    }
    
    if (Math.abs(this.destination.lat - this.location.lat) > this.deltaLat) {
      this.location.lat = this.location.lat + this.deltaLat;
    }
    
    if (Math.abs(this.destination.lng - this.location.lng) > this.deltaLng) {
      this.location.lng = this.location.lng + this.deltaLng;
    }
  }
  
  render () {
    this.marker.setPosition(this.location);
    this.direction.setPath([this.location, this.destination]);
  }
  
  setDestination(location) {
    this.destination = location;
    this.deltaLat = (this.destination.lat - this.location.lat) / 1000;
    this.deltaLng = (this.destination.lng - this.location.lng) / 1000;
    let m = new google.maps.Marker({
      map: this.map,
      position: this.destination,
      label: '1'
    });
  }
}

class Restaurant extends Operator {
  constructor(map, location) {
    super();
    this.marker = new google.maps.Marker({
      position: location,
      map,
      title: 'The 1997',
    });
  }
}
  
google.maps.event.addDomListener(window, 'load', initMap);
