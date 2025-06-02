import { LoadScript } from "@react-google-maps/api";





interface GoogleMapLoaderProps {


    children: React.ReactNode;


  }


  


  const GoogleMapLoader: React.FC<GoogleMapLoaderProps> = ({ children }) => {


    return (


      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>


        {children}


      </LoadScript>


    );


  };


  


  export default GoogleMapLoader;