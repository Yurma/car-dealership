import React, { Component } from 'react';
import {withRouter, Link} from 'react-router-dom'

import {firstUpper, range} from '../common/js/functions'

import { observer, inject } from 'mobx-react';

@inject("VehicleStore")
@observer
class Edit extends Component {
    constructor(props) {
        super (props);

        this.makeChange = this.makeChange.bind(this)
        this.modelChange = this.modelChange.bind(this)
        this.yearChange = this.yearChange.bind(this)
        this.priceChange = this.priceChange.bind(this)
        this.bodyChange = this.bodyChange.bind(this)
        this.doorChange = this.doorChange.bind(this)
        this.engineChange = this.engineChange.bind(this)
        this.fuelChange = this.fuelChange.bind(this)
        this.speedChange = this.speedChange.bind(this)
        this.transmissionChange = this.transmissionChange.bind(this)
        this.trunkChange = this.trunkChange.bind(this)
        this.saveClick = this.saveClick.bind(this)
    }

    componentDidMount() {
        const {vehicleBody, vehicleEngine, vehicleList, vehicleMake, vehicleModel, vehicleTransmission} = this.props.VehicleStore
        const {vehicleId} = this.props.match.params

        const vehicle = vehicleList.filter(vehicle => vehicle.id == vehicleId)[0]
        if (vehicleList.length > 0 && !!vehicle) {
            this.props.VehicleStore.editState = {
                modelVal: vehicle.modelId || 0,
                makeVal: vehicleMake[vehicleModel[vehicle.modelId].makeId].id || 0,
                yearVal: vehicle.year || 0,
                priceVal: vehicle.price || 0,
                bodyVal: vehicle.bodyId || 0,
                doorVal: vehicle.doorCount || 2,
                engineVal: vehicle.engineId || 0,
                fuelVal: vehicle.fuelTank || 0,
                speedVal: vehicle.topSpeed || 100,
                transmissionVal: vehicle.transmissionId || 0,
                trunkVal: vehicle.trunkCapacity || 0,
            }
        }
    }

    componentDidUpdate() {
        const {vehicleBody, vehicleEngine, vehicleList, vehicleMake, vehicleModel, vehicleTransmission} = this.props.VehicleStore
        const {vehicleId} = this.props.match.params

        const vehicle = vehicleList.filter(vehicle => vehicle.id == vehicleId)[0]
        if (vehicleList.length > 0 && !!vehicle && !this.props.VehicleStore.editState.componentUpdated) {
            this.props.VehicleStore.editState = {
                modelVal: vehicle.modelId || 0,
                makeVal: vehicleMake[vehicleModel[vehicle.modelId].makeId].id || 0,
                yearVal: vehicle.year || 0,
                priceVal: vehicle.price || 0,
                bodyVal: vehicle.bodyId || 0,
                doorVal: vehicle.doorCount || 2,
                engineVal: vehicle.engineId || 0,
                fuelVal: vehicle.fuelTank || 0,
                speedVal: vehicle.topSpeed || 100,
                transmissionVal: vehicle.transmissionId || 0,
                trunkVal: vehicle.trunkCapacity || 0,
                componentUpdated: true
            }
        }
    }

    makeChange(event) {
        event.preventDefault();

        const firstModelVal = this.props.VehicleStore.vehicleModel.filter(model => model.makeId == event.target.value)[0].id

        this.props.VehicleStore.editState.makeVal = event.target.value
        this.props.VehicleStore.editState.modelVal = firstModelVal
    }

    modelChange(event) {
        event.preventDefault();

        this.props.VehicleStore.editState.modelVal = event.target.value
    }

    yearChange(event) {
        event.preventDefault();

        this.props.VehicleStore.editState.yearVal = event.target.value
    }

    priceChange(event) {
        event.preventDefault();

        this.props.VehicleStore.editState.priceVal = event.target.value
    }

    bodyChange(event) {
        event.preventDefault();

        this.props.VehicleStore.editState.bodyVal = event.target.value
    }

    doorChange(event) {
        event.preventDefault();

        this.props.VehicleStore.editState.doorVal = event.target.value
    }

    engineChange(event) {
        event.preventDefault();

        this.props.VehicleStore.editState.engineVal = event.target.value
    }

    fuelChange(event) {
        event.preventDefault();

        this.props.VehicleStore.editState.fuelVal = event.target.value
    }

    speedChange(event) {
        event.preventDefault();

        this.props.VehicleStore.editState.speedVal = event.target.value
    }

    transmissionChange(event) {
        event.preventDefault();

        this.props.VehicleStore.editState.transmissionVal = event.target.value
    }

    trunkChange(event) {
        event.preventDefault();

        this.props.VehicleStore.editState.trunkVal = event.target.value
    }

    saveClick(event) {
        event.preventDefault();

        const {bodyVal, doorVal, engineVal, fuelVal, modelVal, priceVal, speedVal, transmissionVal, trunkVal, yearVal} = this.props.VehicleStore.editState

        const {vehicleId} = this.props.match.params

        let vehicleObject = 
            {
                id: vehicleId,
                modelId: Number(modelVal),
                bodyId: Number(bodyVal),
                doorCount: Number(doorVal),
                engineId: Number(engineVal),
                fuelTank: Number(fuelVal),
                price: Number(priceVal),
                topSpeed: Number(speedVal),
                transmissionId: Number(transmissionVal),
                trunkCapacity: Number(trunkVal),
                year: Number(yearVal)
            }

            this.props.VehicleStore.putVehicleList(vehicleObject)
            this.props.history.push(`/vehicle/${vehicleId}`)
    }

    render() {
        const {vehicleBody, vehicleEngine, vehicleList, vehicleMake, vehicleModel, vehicleTransmission} = this.props.VehicleStore
        const {vehicleId} = this.props.match.params
        const vehicle = vehicleList.filter(vehicle => vehicle.id == vehicleId)[0]
        if(!vehicleList.length > 0) {
            this.props.VehicleStore.getVehicleList()
        }

        if(vehicleList.length > 0 && !vehicle) {
            this.props.history.push("/explore")
        }
        
        return (
            <div className="info-page container">
                <Link to={`/vehicle/${vehicleId}`} className="back-btn btn btn-blue">Cancel</Link>
                <button className="back-btn btn btn-blue float-right" onClick={this.saveClick}>Save</button>
                <div className="car-image"></div>
                <div className="d-flex upper-info h4 my-1">
                    <span className="--full">
                        <select className="mr-1" value={this.props.VehicleStore.editState.makeVal} onChange={this.makeChange}>
                            {vehicleMake.map(make => {
                                return <option key={make.id} value={make.id}>{firstUpper(make.name)}</option>
                            })}
                        </select>
                        <select className="mr-1" value={this.props.VehicleStore.editState.modelVal} onChange={this.modelChange}>
                            {vehicleModel.filter(model => model.makeId == this.props.VehicleStore.editState.makeVal).map(model => {
                                return <option key={model.id} value={model.id}>{firstUpper(model.name)}</option>
                            })}
                        </select>
                        <select className="mr-1" value={this.props.VehicleStore.editState.yearVal} onChange={this.yearChange}>
                            {[...range(1900, new Date().getFullYear())].map(year => {
                                return <option key={year} value={year}>{year}</option>
                            })}
                        </select>
                    </span>
                    <span className="h3"><input type="number" value={this.props.VehicleStore.editState.priceVal} onChange={this.priceChange} /> €</span>
                </div>
                <div className="lower-info my-4">
                    <div className="f4">
                        <span className="text-bold">Body type: </span> 
                        <select value={this.props.VehicleStore.editState.bodyVal} onChange={this.bodyChange}> 
                            {vehicleBody.map(body => {
                                return <option key={body.id} value={body.id}>{firstUpper(body.name)}</option>
                            })}
                        </select>
                    </div>
                    <div className="f4">
                        <span className="text-bold">Door count: </span>
                        <select value={this.props.VehicleStore.editState.doorVal} onChange={this.doorChange}>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                    </div>
                    <div className="f4">
                        <span className="text-bold">Engine type: </span>
                        <select value={this.props.VehicleStore.editState.engineVal} onChange={this.engineChange}>
                            {vehicleEngine.map(engine => {
                                return <option key={engine.id} value={engine.id}>{firstUpper(engine.name)}</option>
                            })}
                        </select>
                    </div>
                    <div className="f4">
                        <span className="text-bold">Fuel tank capacity: </span>
                        <input type="number" value={this.props.VehicleStore.editState.fuelVal} onChange={this.fuelChange} /> l
                    </div>
                    <div className="f4">
                        <span className="text-bold">Top speed: </span>
                        <input type="number" value={this.props.VehicleStore.editState.speedVal} onChange={this.speedChange} /> km/h
                    </div>
                    <div className="f4">
                        <span className="text-bold">Transmission type: </span>
                        <select value={this.props.VehicleStore.editState.transmissionVal} onChange={this.transmissionChange}>
                            {vehicleTransmission.map(transmission => {
                                return <option key={transmission.id} value={transmission.id}>{firstUpper(transmission.name)}</option>
                            })}
                        </select>
                    </div>
                    <div className="f4">
                        <span className="text-bold">Trunk capacity: </span>
                        <input type="number" value={this.props.VehicleStore.editState.trunkVal} onChange={this.trunkChange} /> l
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Edit);