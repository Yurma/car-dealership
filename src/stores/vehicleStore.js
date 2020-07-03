import {observable, computed, runInAction} from "mobx";

import VehicleService from './services/vehicleService';
import VehicleModelService from './services/vehicleModelService';
import VehicleMakeService from './services/vehicleMakeService';

import MakeListStore from './makeListStore';
import ModelListStore from './modelListStore';

class VehicleStore {
    constructor() {
        this.vehicleService = new VehicleService();
        this.vehicleModelService = new VehicleModelService();
        this.vehicleMakeService = new VehicleMakeService();
    }
    @observable vehicleMake = [];
    @observable vehicleModel = [];
    @observable vehicleBody = require("../common/data/vehicleBody.json");
    @observable vehicleEngine = require("../common/data/vehicleEngine.json");
    @observable vehicleTransmission = require("../common/data/vehicleTransmission.json");
    @observable vehicleList = [];
    @observable sortBy = "name|asc";
    @observable searchQuery = null;
    @observable filterList = {};
    @observable status = "initial";
    @observable pageNumber = 1;
    @observable showFilters = false;
    @observable totalRecords = 0;

    @observable makePage = 0;
    @observable modelPage = 0;

    @computed get pageCount() {
        return Math.ceil(this.totalRecords / 10);
    }

    handleSort(value) {
        this.sortBy = value;
        this.getVehicleList();
    }
    
    makeCount() {
        MakeListStore.makeCount = this.vehicleMake.length;
        MakeListStore.pageCount = Math.ceil(MakeListStore.makeCount / 15);
    }

    modelCount() {
        ModelListStore.modelCount = this.vehicleModel.filter(x => x.makeId == ModelListStore.makeId).length;
        ModelListStore.pageCount = Math.ceil(ModelListStore.modelCount / 15);
    }


    filtersSet(inputList) {
        this.searchQuery = "WHERE ";
        if (inputList.length > 0) {
            for (const [i, filter] of Array.entries(inputList)){
                (inputList.length > (i + 1)) ? this.searchQuery += filter + " AND " : this.searchQuery += filter;
            }
        } else {
            this.searchQuery = null;
        }
        
        this.pageNumber = 1;
        
        this.getVehicleList();
    }

    pageSet(page) {
        this.pageNumber = page;

        this.getVehicleList();
    }

    getVehicleMake = async () => {
        try {
            let params = {
                rpp: 25,
                page: ++this.makePage
            }
            if (this.sortBy) {
                params.sort = this.sortBy;
            }
            if (this.searchQuery) {
                params.searchQuery = this.searchQuery;
            }
            let data = await this.vehicleMakeService.get(params);
            if(this.makePage == 1) {
                this.vehicleMake = [];
            }
            if (data.totalRecords > (this.makePage * 25)) {
                this.getVehicleMake()
            }
            runInAction(() => {
                for (const item of data.item){
                    this.vehicleMake.push(item);
                }
                this.makeCount();
            })
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    postVehicleMake = async (object) => {
        try {
            let data = await this.vehicleMakeService.post(object);
            runInAction(() => {
                data;
                this.makePage = 0;
                this.getVehicleMake();
            })
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            })
        }
    }

    putVehicleMake = async (object) => {
        try {
            let data = await this.vehicleMakeService.put(object);
            if (data.status == 204){
                runInAction(() => {
                    this.status = "update";
                    this.updateMake(object);
                }
            )}
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            })
        }
    }

    getVehicleModel = async () => {
        try {
            let params = {
                rpp: 25,
                page: ++this.modelPage
            }
            if (this.sortBy) {
                params.sort = this.sortBy;
            }
            if (this.searchQuery) {
                params.searchQuery = this.searchQuery;
            }
            let data = await this.vehicleModelService.get(params);
            if(this.modelPage == 1) {
                this.vehicleModel = [];
            }
            if (data.totalRecords > (this.modelPage * 25)) {
                this.getVehicleModel()
            }
            runInAction(() => {
                for (const item of data.item){
                    this.vehicleModel.push(item);
                }
                this.modelCount();
            })
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    postVehicleModel = async (object) => {
        try {
            let data = await this.vehicleModelService.post(object);
            runInAction(() => {
                data;
                this.modelPage = 0;
                this.getVehicleModel();
            })
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            })
        }
    }

    putVehicleModel = async (object) => {
        try {
            let data = await this.vehicleModelService.put(object);
            if (data.status == 204){
                runInAction(() => {
                    this.status = "update";
                    this.updateModel(object);
                }
            )}
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            })
        }
    }

    getVehicleList = async () => {
        try {
            let params = {
                page: this.pageNumber,
                rpp: 10
            }
            if (this.sortBy) {
                params.sort = this.sortBy;
            }
            if (this.searchQuery) {
                params.searchQuery = this.searchQuery;
            }
            let data = await this.vehicleService.get(params);
            runInAction(() => {
                this.vehicleList = data.item;
                this.totalRecords = data.totalRecords;
            })
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    postVehicleList = async (object) => {
        try {
            let data = await this.vehicleService.post(object);
            runInAction(() => {
                data;
                this.getVehicleList();
            })
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            })
        }
    }

    putVehicleList = async (object) => {
        try {
            let data = await this.vehicleService.put(object);
            if (data.status == 204){
                runInAction(() => {
                    this.status = "update";
                    this.updateVehicle(object);
                }
            )}
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            })
        }
    }

    updateVehicle = (vehicleObject) => {
        let index = this.vehicleList.findIndex(x => x.id === vehicleObject.id);
        this.vehicleList[index] = vehicleObject;
    }
    
    updateModel = (modelObject) => {
        let index = this.vehicleModel.findIndex(x => x.id === modelObject.id);
        this.vehicleModel[index] = modelObject;
    }
    
    updateMake = (makeObject) => {
        let index = this.vehicleMake.findIndex(x => x.id === makeObject.id);
        this.vehicleMake[index] = makeObject;
    }

}

export default new VehicleStore();