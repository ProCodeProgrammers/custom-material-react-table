import React, { useState } from "react";
import { Card, Space } from "antd";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { DeleteOutlined } from "@ant-design/icons";

interface Attribute {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  autoIncrement: boolean;
  primaryKey: boolean;
}

interface Table {
  attributes: Attribute[];
}

const App: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);

  const addTable = () => {
    setTables((prevTables) => [
      ...prevTables,
      { attributes: [] }
    ]);
  };

  const addAttribute = (tableIndex: number) => {
    setTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[tableIndex].attributes.push({
        name: "",
        type: "",
        nullable: false,
        autoIncrement: false,
        primaryKey: false
      });
      return updatedTables;
    });
  };

  const handleAttributeChange = (tableIndex: number, attributeIndex: number, field: string, value: string | boolean) => {
    setTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[tableIndex].attributes[attributeIndex][field] = value;
      return updatedTables;
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedTables = [...tables];

    // Reorder tables
    if (source.droppableId === "tables" && destination.droppableId === "tables") {
      const [table] = updatedTables.splice(source.index, 1);
      updatedTables.splice(destination.index, 0, table);
    }

    // Reorder attributes within a table
    if (
      source.droppableId.startsWith("attributes-") &&
      destination.droppableId.startsWith("attributes-")
    ) {
      const tableIndex = parseInt(source.droppableId.split("-")[1], 10);
      const [attribute] = updatedTables[tableIndex].attributes.splice(source.index, 1);
      updatedTables[tableIndex].attributes.splice(destination.index, 0, attribute);
    }

    setTables(updatedTables);
  };

  const deleteTable = (tableIndex: number) => {
    setTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables.splice(tableIndex, 1);
      return updatedTables;
    });
  };

  const deleteAttribute = (tableIndex: number, attributeIndex: number) => {
    setTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[tableIndex].attributes.splice(attributeIndex, 1);
      return updatedTables;
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tables" type="table">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Space direction="vertical" style={{ padding: "16px" }}>
              {tables.map((table, tableIndex) => (
                <Draggable key={tableIndex} draggableId={`table-${tableIndex}`} index={tableIndex}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <Card
                        title={`Table ${tableIndex + 1}`}
                        extra={<DeleteOutlined onClick={() => deleteTable(tableIndex)} />}
                        style={{ width: "100%" }}
                        {...provided.draggableProps}
                      >
                        <Droppable droppableId={`attributes-${tableIndex}`} type="attribute">
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                              {table.attributes.map((attribute, attributeIndex) => (
                                <Draggable
                                  key={attributeIndex}
                                  draggableId={`attribute-${tableIndex}-${attributeIndex}`}
                                  index={attributeIndex}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <Card
                                        size="small"
                                        title={`Attribute ${attributeIndex + 1}`}
                                        extra={
                                          <DeleteOutlined
                                            onClick={() => deleteAttribute(tableIndex, attributeIndex)}
                                          />
                                        }
                                        style={{ marginTop: "8px" }}
                                      >
                                        <div>
                                          <input
                                            type="text"
                                            value={attribute.name}
                                            onChange={(e) =>
                                              handleAttributeChange(
                                                tableIndex,
                                                attributeIndex,
                                                "name",
                                                e.target.value
                                              )
                                            }
                                            placeholder="Name"
                                          />
                                          <input
                                            type="text"
                                            value={attribute.type}
                                            onChange={(e) =>
                                              handleAttributeChange(
                                                tableIndex,
                                                attributeIndex,
                                                "type",
                                                e.target.value
                                              )
                                            }
                                            placeholder="Type"
                                          />
                                          <label>
                                            Nullable:
                                            <input
                                              type="checkbox"
                                              checked={attribute.nullable}
                                              onChange={(e) =>
                                                handleAttributeChange(
                                                  tableIndex,
                                                  attributeIndex,
                                                  "nullable",
                                                  e.target.checked
                                                )
                                              }
                                            />
                                          </label>
                                          <label>
                                            Auto Increment:
                                            <input
                                              type="checkbox"
                                              checked={attribute.autoIncrement}
                                              onChange={(e) =>
                                                handleAttributeChange(
                                                  tableIndex,
                                                  attributeIndex,
                                                  "autoIncrement",
                                                  e.target.checked
                                                )
                                              }
                                            />
                                          </label>
                                          <label>
                                            Primary Key:
                                            <input
                                              type="checkbox"
                                              checked={attribute.primaryKey}
                                              onChange={(e) =>
                                                handleAttributeChange(
                                                  tableIndex,
                                                  attributeIndex,
                                                  "primaryKey",
                                                  e.target.checked
                                                )
                                              }
                                            />
                                          </label>
                                        </div>
                                      </Card>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        <button onClick={() => addAttribute(tableIndex)}>Add Attribute</button>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Space>
          </div>
        )}
      </Droppable>
      <button onClick={addTable}>Add Table</button>
    </DragDropContext>
  );
};

export default App;
