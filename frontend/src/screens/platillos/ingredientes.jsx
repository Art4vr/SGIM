import React, { useState, useEffect } from 'react';
import api from "../../api/axiosConfig";
import { getProductos, getUnidades } from '../../api/productoApi';
import styles from '../../styles/platillos/nuevaReceta.module.css';
//import stylesCommon from '../../styles/common/common.module.css';

const IngredientesPlatillo = ({ platillo, onClose, onRefresh }) => {
    // UI / data states
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState();
    const [unidades, setUnidades] = useState([]);
    const [productosPlatillo, setProductosPlatillo] = useState([]); // local editable list
    const [removedProductos, setRemovedProductos] = useState([]); // list of idProducto removed
    const [mensaje, setMensaje] = useState('');
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);

    // form states for adding new ingredient
    const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState('');
    const [cantidadNueva, setCantidadNueva] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(productos);

    // load products and units
    const cargarProductos = async () => {
        try {
            const productosRes = await getProductos();
            setProductos(productosRes.data || []);
            const medidasRes = await getUnidades();
            setUnidades(medidasRes.data || []);
        } catch (err) {
            console.error("Error al cargar productos/medidas:", err);
        }
    };

    // load current ingredients of platillo
    useEffect(() => {
        const mostrarIngredientes = async () => {
            if (!platillo) return;
            console.log("platillo: ", platillo);
            try {
                console.log("DENTRO DEL TRY MOSTRAR");
                const res = await api.get(`/api/productosPlatillo/obtener/${platillo.idPlatillo}`);
                console.log("res: ", res);
                const lista = (res.data.resultados || []).map(pp => ({ //Lista de ingredientes
                    idProducto: pp.Producto_idProducto ?? pp.idProducto ?? null,
                    nombreProducto: productos.map(p => p.idProducto === pp.Producto_idProducto ? p.nombre : null).find(n => n !== null) || pp.nombre || 'N/A',
                    cantidad: pp.cantidad ?? '',
                    idUnidadMedida: pp.UnidadMedida_idUnidadMedida,
                    unidadMedida: unidades.map(u => u.idUnidadMedida === pp.UnidadMedida_idUnidadMedida ? u.abreviatura : null).find(m => m !== null),
                    original: true // mark as originally present
                }));
                console.log("lista: ", lista);
                setProductosPlatillo(lista);
                setRemovedProductos([]);
            } catch (err) {
                console.error("Error al obtener ingredientes del platillo:", err);
                setProductosPlatillo([]);
            }
        };
        mostrarIngredientes();
    }, [platillo, productos, unidades]);

    useEffect(() => {
        cargarProductos();
    }, []);

    // helper: add or update local ingredient (used by add flow)
    const addOrUpdateLocalIngredient = (idProducto, nombreProducto, cantidadVal, unidadVal) => {
        if (!idProducto) return;
        console.log("nombre: ", nombreProducto);
        console.log("cantidadVal: ", cantidadVal);
        console.log("unidadVal: ", unidadVal);
        setProductosPlatillo(prev => {
            const existingIndex = prev.findIndex(p => String(p.idProducto) === String(idProducto));
            const item = {
                idProducto,
                nombreProducto,
                cantidad: cantidadVal,
                idUnidadMedida: unidadVal,
                unidadMedida: unidades.map(u => Number(u.idUnidadMedida) === Number(unidadVal) ? u.abreviatura : null).find(m => m !== null),
                original: prev[existingIndex]?.original || false
            };
            console.log("item: ", item);
            if (existingIndex >= 0) {
                const copy = [...prev];
                copy[existingIndex] = item;
                return copy;
            } else {
                return [...prev, item];
            }
        });
        // if it was previously removed, unmark removal
        setRemovedProductos(prev => prev.filter(id => String(id) !== String(idProducto)));
    };

    // add ingredient from select -> local list
    const handleAddIngredient = (e) => {
        e.preventDefault();
        if (!platillo) {
            return setMensaje('Selecciona un platillo primero');
        }
        if (!ingredienteSeleccionado) return setMensaje('Selecciona un ingrediente');
        if (!cantidadNueva || Number(cantidadNueva) <= 0) return setMensaje('Cantidad inválida');
        const prod = productos.find(p => String(p.idProducto) === String(ingredienteSeleccionado));
        addOrUpdateLocalIngredient(
            ingredienteSeleccionado,
            prod?.nombre || 'N/A',
            cantidadNueva,
            idUnidad
        );
        // clear add form
        setIngredienteSeleccionado('');
        setCantidadNueva('');
        setMensaje('');
    };

    // mark ingredient removed locally
    const handleRemoveLocal = (idProducto) => {
        setProductosPlatillo(prev => prev.filter(p => String(p.idProducto) !== String(idProducto)));
        // if it existed originally, add to removed list for server delete
        const orig = productosPlatillo.find(p => String(p.idProducto) === String(idProducto));
        if (orig?.original) {
            setRemovedProductos(prev => {
                if (prev.find(id => String(id) === String(idProducto))) return prev;
                return [...prev, idProducto];
            });
        }
    };

    // change quantity/unit locally
    const handleChangeLocal = (idProducto, field, value) => {
        setProductosPlatillo(prev => prev.map(p => {
            if (String(p.idProducto) !== String(idProducto)) return p;
            return { ...p, [field]: value };
        }));
        console.log("setProductosPlatillo: ", productosPlatillo);
    };

    // Submit: compute adds, updates and deletes and call API accordingly
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!platillo) return setMensaje('Selecciona un platillo primero');

        const toDelete = [...removedProductos]; // idProducto[]
        const toUpsert = []; // { idProducto, cantidad, unidadMedida }

        // Build lists
        productosPlatillo.forEach(p => {
            // required validations
            if (!p.idProducto || !p.cantidad || Number(p.cantidad) <= 0) {
                // skip invalid rows
                return;
            }
            console.log("toUpsert p: ", p);
            toUpsert.push({
                idProducto: p.idProducto,
                cantidad: Number(p.cantidad),
                unidadMedida: p.idUnidadMedida || null,
                //nombreUnidadMedida: p.unidadMedida || '--',
                original: !!p.original
            });
            console.log("toUpsert 2: ", toUpsert);
        });

        setCargando?.(true); // harmless if undefined
        try {
            // Deletes first
            for (const idProd of toDelete) {
                try {
                    await api.delete(`/api/productosPlatillo/eliminar/${platillo.idPlatillo}`, {
                        data: { idProducto: idProd, idPlatillo: platillo.idPlatillo }
                    });
                } catch (err) {
                    console.error('Error eliminando ingrediente', idProd, err);
                }
            }

            // For upserts: if original=false -> add, else -> update
            for (const item of toUpsert) {
                const payload = {
                    idPlatillo: platillo.idPlatillo,
                    idProducto: Number(item.idProducto),
                    cantidad: item.cantidad,
                    unidadMedida: Number(item.unidadMedida)
                };
                console.log("payload: ", payload);
                try {
                    if (item.original) {
                        // update existing ingredient
                        console.log("editar");
                        await api.put(`/api/productosPlatillo/editar/${platillo.idPlatillo}`, payload);
                    } else {
                        // add new ingredient
                        console.log("agregar -  payload: ", payload);
                        await api.post(`/api/productosPlatillo/agregar`, payload);
                    }
                } catch (err) {
                    console.error('Error guardando ingrediente', item.idProducto, err);
                }
            }

            setGuardadoExitoso(true);
            setMensaje('✅ Cambios guardados con éxito');
            setTimeout(async () => {
                if (onRefresh) await onRefresh();
                if (onClose) onClose();
            }, 900);
        } catch (err) {
            console.error(err);
            setMensaje(err.response?.data?.mensaje || 'Error al guardar cambios');
        } finally {
            setCargando?.(false);
        }
    };

    //Filtrado de nombre de producto autocompletado
    // Filtrar productos según lo que se escribe
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        const filtered = productos.filter(p => p.nombre.toLowerCase().includes(value.toLowerCase()));
        console.log("filtered: ", filtered);
        setFilteredProducts(filtered);
    };

    // Manejar la selección de un producto
    const handleSelect = (idProducto) => {
        setIngredienteSeleccionado(idProducto);
        setSearchTerm(''); // Limpiar el campo de búsqueda después de seleccionar
    };

    
    // Primero, encontramos el producto seleccionado
    console.log("ingredienteSeleccionado: ", ingredienteSeleccionado);
    const productoSeleccionado = productos.find(p => p.idProducto === Number(ingredienteSeleccionado));
    console.log("productoSeleccionado: ", productoSeleccionado);
    // Luego, encontramos la unidad de medida asociada a ese producto
    const unidadMedida = productoSeleccionado 
        ? unidades.find(u => u.medida === productoSeleccionado.unidad) 
        : null;

    // Si encontramos la unidad, mostramos su abreviatura
    const abreviaturaUnidad = unidadMedida ? unidadMedida.abreviatura : '';
    const idUnidad = unidadMedida ? unidadMedida.idUnidadMedida : null;
    console.log("idUnidad: ", idUnidad);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{platillo?.nombre ?? 'Ingredientes'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>❌</button>
                </div>

                <div className={styles.filterContainer}>
                    <h3>Ingredientes</h3>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
                    <div className={styles.inputContainer}>
                        {productosPlatillo.length === 0 && (
                            <div style={{ marginBottom: 10, color: '#666' }}>La receta está vacía. Agrega ingredientes abajo.</div>
                        )}

                        {productosPlatillo.map((pp, idx) => (
                            <div key={pp.idProducto ?? idx} className={styles.ingredienteItem} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                                <div style={{ flex: 1 }}>
                                    <strong>{pp.nombreProducto}</strong>
                                </div>

                                <input
                                    type="number"
                                    min="0"
                                    step="1.0"
                                    value={pp.cantidad}
                                    onChange={(e) => handleChangeLocal(pp.idProducto, 'cantidad', e.target.value)}
                                    style={{ width: 100 }}
                                />

                                <select
                                    value={pp.idUnidadMedida || ''}
                                    onChange={(e) => handleChangeLocal(pp.idProducto, 'unidadMedida', e.target.value)}
                                >
                                    <option value={pp.idUnidadMedida}>{pp.unidadMedida}</option>
                                    
                                </select>

                                <button className={styles.botonGral} type="button" onClick={() => handleRemoveLocal(pp.idProducto)} >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add new ingredient controls */}
                    <div className={styles.agregarContainer}>
                        <h4 className={styles.subtitulos}>Agregar ingrediente</h4>
                        <div  className={styles.filterContainer}>
                            <div>
                                <input
                                    className={styles.filterInput}
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder={productos.find(p => Number(p.idProducto) === Number(ingredienteSeleccionado)) 
                                        ? productos.find(p => Number(p.idProducto) === Number(ingredienteSeleccionado)).nombre 
                                        : 'Ingrediente...'}
                                    
                                />
                                {searchTerm && filteredProducts.length > 0 && (
                                    <ul className={styles.filterList}>
                                        {filteredProducts.map((p) => {
                                            return (
                                                <li
                                                    key={p.idProducto}
                                                    onClick={() => handleSelect(p.idProducto)}
                                                    className={styles.listaProductos}
                                                >
                                                    {p.nombre}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <input
                                    className={styles.filterInputCant} 
                                    type="number"
                                    min="0"
                                    step="1.0"
                                    placeholder="Cantidad"
                                    value={cantidadNueva}
                                    onChange={e => setCantidadNueva(e.target.value)}
                                    style={{ width: 100 }}
                                />
                            </div>
                            
                            <div>
                                <label>{abreviaturaUnidad}</label>
                            </div>

                            <button className={styles.botonGral} type="button" onClick={handleAddIngredient} style={{ padding: '6px 12px' }}>
                                Añadir
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <button className={styles.botonGral} type="submit" style={{ padding: '8px 14px' }}>Guardar Receta</button>
                        </div>

                    {mensaje && <div className={styles.mensaje} style={{ marginTop: 10 }}>{mensaje}</div>}
                </form>
            </div>
        </div>
    );
};

export default IngredientesPlatillo;