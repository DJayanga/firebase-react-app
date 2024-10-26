import React, { useState, useEffect } from "react";
import { database, ref, onValue, push, update, remove } from "./firebaseConfig";

const DataComponent = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const itemsRef = ref(database, "items");
        onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            const itemList = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
            setItems(itemList);
        });
    }, []);

    const addItem = () => {
        const itemsRef = ref(database, "items");
        if (name.trim() && description.trim()) {
            push(itemsRef, { name, description });
            setName("");
            setDescription("");
        }
    };
    const updateItem = (id, newName, newDescription) => {
        const itemRef = ref(database, `items/${id}`);
        update(itemRef, { name: newName, description: newDescription });
    };

    const deleteItem = (id) => {
        const itemRef = ref(database, `items/${id}`);
        remove(itemRef);
    };
    
    return (
        <div>
            <h2>Firebase CRUD App</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <button onClick={addItem}>Add Item</button>
    
            {items.map((item) => (
                <div key={item.id}>
                    <p><strong>Name:</strong> {item.name}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                    <button onClick={() => updateItem(item.id, "Updated Name", "Updated Description")}>Update</button>
                    <button onClick={() => deleteItem(item.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
    };
    export default DataComponent;
    