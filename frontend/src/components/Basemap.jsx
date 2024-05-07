"use client";
import api from "../api"
import "../styles/map.css";
import '@arcgis/core/assets/esri/themes/dark/main.css';
import { ArcgisExpand, ArcgisLegend, ArcgisMap } from "@arcgis/map-components-react";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import config from "@arcgis/core/config"
import {useState, useRef, useEffect } from "react"
import {defineCustomElements} from "@arcgis/map-components/dist/loader"
import * as geometry from "@arcgis/core/geometry.js";
import * as symbols from "@arcgis/core/symbols.js";

defineCustomElements();


import "@arcgis/map-components/dist/components/arcgis-map"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic";

function Basemap() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [lat, setLat] = useState(0)
    const [long, setLong] = useState(0)
    

    
    const getSpots = (layer) => {
        api
            .get("api/spots/")
            .then((res) => res.data)
            .then((data) => {
                console.log(data)
                data.map((data) => {
                    layer.graphics.add(new Graphic({
                        geometry: new geometry.Point({
                            latitude: data.lat,
                            longitude: data.long
                        }),
                        symbol: new symbols.SimpleMarkerSymbol(),
                        attributes: {
                            Title: data.title,
                            Description: data.desc,
                            Author: data.author
                        },
                        popupTemplate: {
                            title: "{Title}",
                            content: [{
                                type: "fields",
                                fieldInfos: [
                                    {
                                        fieldName: "Title"
                                    },
                                    {
                                        fieldName: "Description"
                                    },
                                    {
                                        fieldName: "Author"
                                    }
                                ]
                            }]
                        }
                    }))
                })
            })
            .catch((err) => alert("getSpots Error: "+ err))
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function handleViewReady() {
        console.log("Map is ready")
        const mapElement = document.querySelector("arcgis-map");
        const layer = new GraphicsLayer({})
        
        mapElement.map.add(layer)


        getSpots(layer);


        mapElement.addEventListener("arcgisViewClick", async(e) => {

            console.log("Click: ", e.detail)

            setLat(e.detail.mapPoint.latitude)
            setLong(e.detail.mapPoint.longitude)
            let temp = new Graphic({
                geometry: new geometry.Point({
                    latitude: e.detail.mapPoint.latitude,
                    longitude: e.detail.mapPoint.longitude
                }),
                symbol: new symbols.SimpleMarkerSymbol(),
            })


            layer.graphics.add(temp);
            await sleep(8000)
            layer.graphics.remove(temp)
        })


    }

    const createSpot = (e) => {
        e.preventDefault()
        console.log("Creating Spot")
        console.log("title: ", title)
        console.log("desc: ", description)
        console.log("lat: ", lat)
        console.log("long: ", long)
        api.post("api/spots/", {
            title: title,
            desc: description,
            lat: lat,
            long: long
        }).then((res) => {
                if (res.status === 201) alert("Created Spot")
                else alert("Failed to create spot")
                
            }).catch((err) => alert(err))
        console.log("Done Creating Spot")
    }
    // startX = -80.2
    // startY = 25.7
    // oceanmapID = "67ab7f7c535c4687b6518e6d2343e8a2"
    return (<>
        <div className="mapContainer">
            <div className="centerMe">
                <ArcgisMap itemId="67ab7f7c535c4687b6518e6d2343e8a2" center="-80.2, 25.7" zoom={11} onArcgisViewReadyChange={handleViewReady}></ArcgisMap>
            </div>
        </div>
        <div className="formContainer">
        <form style={{width: "100%"}} onSubmit={createSpot} className="spotFormContainer">
            <h1>Create a new location</h1>
            <input
            className=""
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            />
            <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a breif Description"
            />

            <div style={{display: "flex", justifyContent: "space-between"}}>
                <input
                style={{maxWidth: "48%"}}
                type="long"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder= {lat === 0 ? "Latitude" : lat}
                readOnly
                />
                <input
                style={{maxWidth: "48%"}}
                type="long"
                value={long}
                onChange={(e) => setLong(e.target.value)}
                placeholder={long === 0 ? "Longitude" : long}
                readOnly
                />
            </div>
            <div style={{textAlign: "center"}}>
                <button style={{maxWidth: "fit-content", padding: "10px"}} className="form-button" type="submit">Create</button>
            </div>
            

        </form>
        </div>
        </>
    );
}

export default Basemap