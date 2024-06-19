"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const locations_1 = require("./services/locations");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
app.get('/', (_req, res) => {
    res.send(locations_1.locations);
});
app.get('/cities', (_req, res) => {
    const cities = [...new Set(locations_1.locations.map(location => location.city))];
    cities.length > 0 ? res.send(cities) : res.status(500).json({ error: 'Error del servidor' });
});
app.get('/districts', (_req, res) => {
    const districts = [...new Set(locations_1.locations.map(location => location.district))];
    districts.length > 0 ? res.send(districts) : res.status(500).json({ error: 'Error del servidor' });
});
app.get('/:city/districts', (req, res) => {
    const cityParam = req.params.city.toLowerCase();
    const districts = locations_1.locations.filter(location => location.city.toLowerCase() === cityParam);
    const result = districts.map(location => location.district);
    result.length > 0 ? res.send(result) : res.status(404).json({ error: 'Ciudad no encontrada' });
});
app.get('/:city/units', (req, res) => {
    const cityParam = req.params.city.toLowerCase();
    const unit = locations_1.locations.filter(location => location.city.toLowerCase() === cityParam);
    const result = unit.reduce((sum, location) => sum + location.units, 0);
    result > 0 ? res.json(result) : res.status(404).json({ error: 'Ciudad no encontrada' });
});
app.get('/:district', (req, res) => {
    const disctrictParam = req.params.district.toLowerCase();
    const unit = locations_1.locations.filter(location => location.district.toLowerCase() === disctrictParam);
    const result = unit.map(location => location.units);
    result.length > 0 ? res.send(result) : res.status(404).json({ error: 'Distrito no encontrado' });
});
app.get('/search/:text', (req, res) => {
    const searchText = req.params.text.toLowerCase();
    const cityMatch = locations_1.locations.find(location => location.city.toLowerCase().includes(searchText));
    const districtMatch = locations_1.locations.find(location => location.district.toLowerCase().includes(searchText));
    let bestMatch = null;
    if (cityMatch) {
        bestMatch = {
            found: true,
            rate: searchText.length / cityMatch.city.length,
            city: cityMatch.city,
            name: cityMatch.city,
            type: 'CITY'
        };
    }
    else if (districtMatch) {
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
