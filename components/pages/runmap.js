// import React from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   PermissionsAndroid
// } from "react-native";
// import MapView, {
//   Marker,
//   AnimatedRegion,
//   Polyline,
//   PROVIDER_GOOGLE
// } from "react-native-maps";
// import haversine from "haversine";


// const LATITUDE_DELTA = 0.009;
// const LONGITUDE_DELTA = 0.009;
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;

// class Runmap extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       latitude: LATITUDE,
//       longitude: LONGITUDE,
//       routeCoordinates: [],
//       distance: 0,
//       prevLatLng: {},
//       coordinate: new AnimatedRegion({
//        latitude: LATITUDE,
//        longitude: LONGITUDE
//       })
//     };
//   }

//   componentDidMount(){
//     this.getLocation = navigator.geolocation.watchPosition(

//       position => {
//         const { coordinate, routeCoordinates, distance } = this.state;
//         const { latitude, longitude } = position.coords;

//         const newCoords = {
//           latitude,
//           longitude
//         };

//         if (this.marker) {
//           this.marker._component.animateMarkerToCoordinate(
//             newCoordinate,
//             500
//           );
//         }






//       }

//     )

//   }

//   render() {
//     return(

  //     <View style={{ flex: 1 }}>
  //       <MapView
  //         style={{ flex: 1 }}
  //         initialRegion={{
  //           latitude: 37.78825,
  //           longitude: -122.4324,
  //           latitudeDelta: 0.0922,
  //           longitudeDelta: 0.0421
  //         }}>
  //         </MapView>
  //     </View>

  //     <View style={styles.container}>
  //       <MapView
  //         style={styles.map}
  //         provider={PROVIDER_GOOGLE}
  //         showUserLocation
  //         followUserLocation
  //         loadingEnabled
  //         region={this.getMapRegion()}
  //       >
  //         <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
  //         <Marker.Animated
  //           ref={marker => {
  //             this.marker = marker;
  //           }}
  //           coordinate={this.state.coordinate}
  //         />
  //       </MapView>

  //       <View style={styles.buttonContainer}>
  //         <TouchableOpacity style={[styles.bubble, styles.button]}>
  //           <Text style={styles.bottomBarContent}>
  //             {parseFloat(this.state.distance).toFixed(2)} km
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
//       )
//     }


// }

// export default Runmap;