import React, { useState, useEffect } from 'react';
import api from "../../api/axiosConfig";
import { getProductos, getUnidades } from '../../api/productoApi';
import styles from '../../styles/platillos/nuevaReceta.module.css';
import stylesCommon from '../../styles/common/common.module.css';

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
    const [unidadNueva, setUnidadNueva] = useState('');

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
        setUnidadNueva('');
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
            console.log("toUpsert: ", p);
            toUpsert.push({
                idProducto: p.idProducto,
                cantidad: Number(p.cantidad),
                unidadMedida: p.idUnidadMedida || null,
                original: !!p.original
            });
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

    // filtered products for select
    const [filtros, setFiltros] = useState({ nombre: '' });
    const productosFiltrados = productos.filter(p =>
        p.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase())
    );
    const handleFiltroChange = (e) => setFiltros({ ...filtros, nombre: e.target.value });

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

                <div className={stylesCommon.filterContainer} style={{ marginTop: 8 }}>
                    <h3>Ingredientes</h3>
                    <input
                        type="text"
                        placeholder="Filtrar por nombre"
                        value={filtros.nombre}
                        onChange={handleFiltroChange}
                        className={stylesCommon.filterInput}
                    />
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
                                    step="0.01"
                                    value={pp.cantidad}
                                    onChange={(e) => handleChangeLocal(pp.idProducto, 'cantidad', e.target.value)}
                                    style={{ width: 100 }}
                                />

                                <select
                                    value={pp.idUnidadMedida || ''}
                                    onChange={(e) => handleChangeLocal(pp.idProducto, 'unidadMedida', e.target.value)}
                                >
                                    <option value={pp.idUnidadMedida}>{pp.unidadMedida}</option>
                                    {unidades.map(u => (
                                        <option key={u.idUnidadMedida} value={u.idUnidadMedida}>{u.abreviatura ?? u.medida}</option>
                                    ))}
                                </select>

                                <button type="button" onClick={() => handleRemoveLocal(pp.idProducto)} style={{ background: 'transparent', border: 'none', color: '#b13960', cursor: 'pointer' }}>
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add new ingredient controls */}
                    <div style={{ borderTop: '1px solid #eee', paddingTop: 12, marginTop: 8 }}>
                        <h4>Agregar ingrediente</h4>
                        <div  className={styles.filterContainer}>
                            <select value={ingredienteSeleccionado} onChange={e => setIngredienteSeleccionado(e.target.value)}>
                                <option value="">Selecciona un ingrediente</option>
                                {productosFiltrados.map(prod => (
                                    <option key={prod.idProducto} value={prod.idProducto}>{prod.nombre}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Cantidad"
                                value={cantidadNueva}
                                onChange={e => setCantidadNueva(e.target.value)}
                                style={{ width: 100 }}
                            />
                            
                            <h3>{abreviaturaUnidad}</h3>

                            <button type="button" onClick={handleAddIngredient} style={{ padding: '6px 12px' }}>
                                Añadir
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <button type="submit" style={{ padding: '8px 14px' }}>Guardar Receta</button>
                        <button type="button" onClick={onClose} style={{ marginLeft: 8, padding: '8px 14px' }}>Cancelar</button>
                    </div>

                    {mensaje && <div className={styles.mensaje} style={{ marginTop: 10 }}>{mensaje}</div>}
                </form>
            </div>
        </div>
    );
};

export default IngredientesPlatillo;