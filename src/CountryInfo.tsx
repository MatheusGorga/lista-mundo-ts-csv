import React, { useState, useEffect } from "react";
import {
  Country,
  State,
  ICountry,
  City,
  ICity,
  IState,
} from "country-state-city";
import { data } from "./data";
import { CSVLink } from "react-csv";

interface LocationProps {
  cd_pais: string;
  cd_estado: string;
  ds_estado: string;
  ds_cidade: string;
  latitude: string;
  longitude: string;
}

// codigo_pais, codigo_estado, nome_estado, ds_cidade, latitude, longitude

function App() {
  const [locations, setLocations] = useState<LocationProps[]>([]);

  useEffect(() => {
    const getAllLocation = () => {
      const countries: ICountry[] = Country.getAllCountries();
      const allLocations: any = [];
      
      countries.forEach((country) => {
        const states: IState[] = State.getStatesOfCountry(country.isoCode);
       
        states.forEach((state) => {
          const cities: ICity[] = City.getCitiesOfState(country.isoCode, state.isoCode);

          cities.forEach((city) => {
            allLocations.push({
              cd_pais: country.isoCode
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""),
              cd_estado: state.isoCode
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""),
              ds_estado: state.name
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""),
              ds_cidade: city.name
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""),
              latitude: city.latitude,
              longitude: city.longitude,
            });
          });
        });
      });

      setLocations(allLocations);
    };

    getAllLocation();
  }, []);

  const lala = locations.filter(function (location) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (location.cd_pais === element) {
        return false; // Se encontrarmos uma correspondência, retornamos false imediatamente
      }
    }
    return true; // Se não houver correspondência, retornamos true
  });

  return (
    <div className="App">
      <div>
        <CSVLink data={lala}> Download de: {lala.length}</CSVLink>
        {/* <ul>
          {lala.map((location, index) => (
            <li key={index}>
              {"INSERT INTO public.pais ("}
              {"fn_get_new_key('pais', 'cd_pais')"},{"'NULL'"},{"'"}
              {location.pais}
              {"'"},{"'"}
              {location.sigla}
              {"'"}, {"'NULL'"}, {"now()"}, {"1"}, {"now()"}, {"'SYS_ADMIM'"},{" "}
              {"'SYS_ADMIM'"}
              {");"}
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

export default App;
