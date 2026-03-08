import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TodoItem from "./TodoItem";

const TodoList = ({ todos, fetchTodos, setTodos, setSelectedTask }) => {

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reordered = Array.from(todos);
        const [movedItem] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, movedItem);

        setTodos(reordered);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todos">
                {(provided) => (
                    <ul
                        className="todo-list"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {todos.map((todo, index) => (
                            <Draggable
                                key={todo.id.toString()}
                                draggableId={todo.id.toString()}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={() => setSelectedTask(todo)}
                                    >
                                        <TodoItem
                                            todo={todo}
                                            fetchTodos={fetchTodos}
                                            setSelectedTask={setSelectedTask}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}

                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default TodoList;