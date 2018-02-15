const createYandexMapMock = onMapInitializationFinished => {
  class EventsCollection {
    add = () => {}
  }

  class GeoObjectCollection {
    constructor() {
      this.events = new EventsCollection()
    }

    add = () => {}
    set = () => {}
    getLength = () => {}
    each = () => {}
    splice = () => {}
  }

  class OptionsCollection {
    get = () => this
    fromGlobalPixels = () => 'test'
  }

  class LineString {
    set = () => {}
    splice = () => {}
  }

  class Geometry {
    LineString = () => new LineString()
    getCoordinates = () => {}
  }

  class Polyline {}

  class GeoObject {
    constructor() {
      this.geometry = new Geometry()
      this.events = new EventsCollection()
      this.properties = {
        get: () => {},
        set: () => {},
      }
      this.hint = {
        open: () => {},
      }
    }
  }

  class Map {
    constructor() {
      this.geoObjects = new GeoObjectCollection()
      this.events = new EventsCollection()
      this.options = new OptionsCollection()
    }
  }

  const geocode = async () => ({
    geoObjects: {
      get: () => ({
        getAddressLine: () => 'Test Address',
      }),
    },
  })

  return {
    ready: callback => {
      callback()
      onMapInitializationFinished()
    },
    geometry: new Geometry(),
    geocode,
    Map,
    GeoObject,
    GeoObjectCollection,
    Polyline,
  }
}

export default createYandexMapMock
