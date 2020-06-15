import { Link } from 'react-router-dom';
import { LeafletMouseEvent } from 'leaflet';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';

import './styles.css';
import logo from '../../assets/logo.svg';

import api from '../../services/api';
import ibge from '../../services/ibge';

interface Item {
    id: number;
    title: string;
    url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('0');
    const [selectedState, setSelectedState] = useState<string>('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    useEffect(() => {
        api.get('items')
            .then(response => setItems(response.data))
    }, [])

    useEffect(() => {
        ibge.get<IBGEUFResponse[]>('estados?orderBy=nome')
            .then(response => {
                const ufs = response.data.map(uf => uf.sigla);
                setStates(ufs)
            })
    }, [])

    useEffect(() => {
        ibge.get<IBGECityResponse[]>(`estados/${selectedState}/municipios`)
            .then(response => {
                const cities = response.data.map(city => city.nome);
                setCities(cities)
            })
    }, [selectedState])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
            setSelectedPosition([latitude, longitude]);
        });
    }, [])

    function handleMapClick (event: LeafletMouseEvent) {
        setSelectedPosition([event.latlng.lat, event.latlng.lng])
    }

    function handleSelectedState (event: ChangeEvent<HTMLSelectElement>) {
        setSelectedState(event.target.value)
    }

    function handleSelectedCity (event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value)
    }

    function handleInputChange (event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value });
    }

    function handleSelectItem (id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    async function handleSubmitForm (event: FormEvent) {
        event.preventDefault();

        const uf = selectedState;
        const city = selectedCity;
        const items = selectedItems;
        const { name, email, whatsapp } = formData;
        const [latitude, longitude] = selectedPosition;

        const data = {
            uf,
            city,
            name,
            email,
            items,
            whatsapp,
            latitude,
            longitude
        }

        await api.post('points', data);
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmitForm}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input 
                            id="name"
                            name="name"
                            type="text"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                id="email"
                                type="email"
                                name="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                id="whatsapp"
                                name="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}>
                        </Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select 
                                id="uf"
                                name="uf"
                                value={selectedState}
                                onChange={handleSelectedState}
                            >
                                <option value="0">Selecione um Estado</option>
                                {
                                    states.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                id="city"
                                name="city"
                                value={selectedCity}
                                onChange={handleSelectedCity} 
                            >
                                <option value="0">Selecione uma Cidade</option>
                                {
                                    cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {
                            items.map(item => (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelectItem(item.id)}
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
                                    <img src={item.url} alt={item.title}/>
                                    <span>{item.title}</span>
                                </li>
                            ))
                        }
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;