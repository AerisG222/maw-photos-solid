export class MapZoomLevel {
    constructor(public value: number, public name: string) {
        this.value = value;
        this.name = name;
    }
}

export const allMapZoomLevels = [
    new MapZoomLevel(1, '1 - World'),
    new MapZoomLevel(2, '2'),
    new MapZoomLevel(3, '3'),
    new MapZoomLevel(4, '4'),
    new MapZoomLevel(5, '5 - Landmass/continent'),
    new MapZoomLevel(6, '6'),
    new MapZoomLevel(7, '7'),
    new MapZoomLevel(8, '8'),
    new MapZoomLevel(9, '9'),
    new MapZoomLevel(10, '10 - City'),
    new MapZoomLevel(11, '11'),
    new MapZoomLevel(12, '12'),
    new MapZoomLevel(13, '13'),
    new MapZoomLevel(14, '14'),
    new MapZoomLevel(15, '15 - Streets'),
    new MapZoomLevel(16, '16'),
    new MapZoomLevel(17, '17'),
    new MapZoomLevel(18, '18'),
    new MapZoomLevel(19, '19'),
    new MapZoomLevel(20, '20 - Buildings'),
    new MapZoomLevel(21, '21'),
    new MapZoomLevel(22, '22'),
];
