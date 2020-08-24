class Persona {
    constructor(){
        this.nombres = null;
        this.apellidos = null;
        this.direccion = null;
        this.numeroDocumento = null;
        this.idTipoDocumento = null;
        this.fechaCreacion = null;
        this.fechaModificacion = null;
        this.estado = null;
    }

    initModel (data) {
        this.nombres = data.nombres;
        this.apellidos = data.apellidos;
        this.direccion = data.direccion;
        this.numeroDocumento = data.numeroDocumento;
        this.idTipoDocumento = data.idTipoDocumento;
        this.fechaCreacion = data.fechaCreacion;
        this.fechaModificacion = data.fechaModificacion;
        this.estado = data.estado;

    }

    getAge () { return this.age;}

    setAge (age) { this.age = age; }

    getName () {this.name;}

    setName (name) {this.name = name;}
}

module.exports = Persona;