import React, { useEffect, useState } from 'react'
import { MainWrapper } from './styles.module'
import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { BsSunFill, BsWind } from "react-icons/bs";
import { BsFillSunFill,BsCloudyFill,BsFillCloudRainFill,BsCloudFog2Fill } from "react-icons/bs";
import { RiLoader2Fill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from 'axios';



interface WeatherDataProps {
  name: string;

  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    country: string;
  };
  weather: {
    main: string;
  }[];
  wind: {
    speed: number;
  };
}

const DisplayWeather = () => {
  const api_key = "7c0526e7671de3f454e0399bd319b1d7";
  const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(
    null
  );

  const[isLoading,setIsLoading]=useState(false);

  const[searchCity,setSearchCity]=useState("");


  const fetchWeatherData = async (city: string) => {
    try {
      const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
      const searchResponse = await axios.get(url);

      const currentWeatherData: WeatherDataProps = searchResponse.data;
      return { currentWeatherData };
    } catch (error) {
      throw error;
    }
  };
  const handleSearch = async () => {
    if (searchCity.trim() === "") {
      return;
    }

    try {
      const { currentWeatherData } = await fetchWeatherData(searchCity);
      setWeatherData(currentWeatherData);
    } catch (error) {
    }
  };

  const fetchCurrentWeather=async(lat:number,lon:number)=>{
    const url= `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response= await axios.get(url);
    return response.data;

  }
  const iconChanger=(weather:string)=>{
    let iconElement:React.ReactNode;
    let iconColor:string;
    switch(weather){
      case"Rain":
      iconElement=<BsFillCloudRainFill/>
      iconColor="#242829"
      break;

      case"Clear":
      iconElement=<BsSunFill/>
      iconColor="#FFC436"
      break;

      case"Clouds":
      iconElement=<BsCloudyFill/>
      iconColor="#102C57"
      break;

      case"Mist":
      iconElement=<BsCloudFog2Fill/>
      iconColor="#279EFF"
      break;


      default:
        iconElement=<TiWeatherPartlySunny/>
        iconColor="#7B2869"
    }

    return (
      <span className="icon" style={{color:iconColor}}>
        {iconElement}
      </span>
    )
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchCurrentWeather(latitude, longitude).then((currentWeather) => {
        setWeatherData(currentWeather);
        setIsLoading(false);
      });
    });
  }, []); 

  return (
    <MainWrapper>
      <div className="container">
        <div className="searchArea">
          <input type="text" placeholder="enter a city" 
          value={searchCity}
          onChange={(e)=>setSearchCity(e.target.value)}/>
          <div className="searchCircle">
        <AiOutlineSearch className="searchIcon"  onClick={handleSearch}/>
        </div>
        </div>

        {weatherData && isLoading ? (
          <>
            <div className="weatherArea">
              <h1>{weatherData.name}</h1>
              <span>{weatherData.sys.country}</span>
              <div className="icon">
                {iconChanger(weatherData.weather[0].main)}
              </div>
              <h1>{weatherData.main.temp.toFixed(0)}</h1>
              <h2>{weatherData.weather[0].main}</h2>
            </div>

            <div className="bottomInfoArea">
              <div className="humidityLevel">
                <WiHumidity className="windIcon" />
                <div className="humidInfo">
                  <h1>{weatherData.main.humidity}%</h1>
                  <p>Humidity</p>
                </div>
              </div>

              <div className="wind">
                <BsWind className="windIcon" />
                <div className="humidInfo">
                  <h1>{weatherData.wind.speed}km/h</h1>
                  <p>Wind speed</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="loading">
            <RiLoader2Fill className="loadingIcon" />
            <p>Loading</p>
          </div>
        )}
      </div>
    </MainWrapper>
  );
};

export default DisplayWeather
