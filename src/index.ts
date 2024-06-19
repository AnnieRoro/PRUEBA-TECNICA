import express from 'express'
import { locations } from './services/locations'


const app = express()
app.use(express.json())

const PORT = 3000

app.get('/', (_req, res) => {
    res.send(locations);
});


app.get('/cities', (_req, res) => {
    const cities = [...new Set(locations.map(location => location.city))];
    cities.length > 0 ? res.send(cities) : res.status(500).json({ error: 'Error del servidor' });
});


app.get('/districts', (_req, res) => {
    const districts = [...new Set(locations.map(location => location.district))];
    districts.length > 0 ? res.send(districts) : res.status(500).json({ error: 'Error del servidor' });
});


app.get('/:city/districts', (req, res) => {
    const cityParam = req.params.city.toLowerCase();
    const districts = locations.filter(location => location.city.toLowerCase() === cityParam);
    const result = districts.map(location => location.district);
    result.length > 0 ? res.send(result) : res.status(404).json({ error: 'Ciudad no encontrada' });
});


app.get('/:city/units', (req, res) => {
    const cityParam = req.params.city.toLowerCase();
    const unit = locations.filter(location => location.city.toLowerCase() === cityParam);
    const result = unit.reduce((sum, location) => sum + location.units, 0);
    result > 0 ? res.json(result) : res.status(404).json({ error: 'Ciudad no encontrada' });
});


app.get('/:district', (req, res) => {
    const disctrictParam = req.params.district.toLowerCase();
    const unit = locations.filter(location => location.district.toLowerCase() === disctrictParam);
    const result = unit.map(location => location.units);
    result.length > 0 ? res.send(result) : res.status(404).json({ error: 'Distrito no encontrado' }); 
});


app.get('/search/:text', (req, res) => {
    const searchText = req.params.text.toLowerCase();

    const cityMatch = locations.find(location => location.city.toLowerCase().includes(searchText));
    const districtMatch = locations.find(location => location.district.toLowerCase().includes(searchText));

    let bestMatch = null;

    if (cityMatch) {
        bestMatch = {
            found: true,
            rate: searchText.length / cityMatch.city.length,
            city: cityMatch.city,
            name: cityMatch.city,
            type: 'CITY'
        };
    } else if (districtMatch) {
        bestMatch = {
            found: true,
            rate: searchText.length / districtMatch.district.length,
            city: districtMatch.city,
            name: districtMatch.district,
            type: 'DISTRICT'
        };
    }
    bestMatch ? res.json(bestMatch) : res.status(404).json({ error: 'No se han encontrado ciudades o distritos' });
});


app.use((_req, res) => {
    res.status(404).send({ error: "Endpoint not found" });
});


app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

