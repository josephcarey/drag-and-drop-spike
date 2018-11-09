import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";

import NavSpacer from "../NavSpacer/NavSpacer";

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  card: {
    marginTop: 16,
    width: 300,
  },
});

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  // result[droppableSource.droppableId] = sourceClone;
  // result[droppableDestination.droppableId] = destClone;

  result.source = sourceClone;
  result.destination = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

class TestDnD extends Component {
  state = {
    items: [
      {
        id: 0,
        content: "Cool Person 0",
      },
      {
        id: 1,
        content: "Cool Person 1",
      },
      {
        id: 2,
        content: "Cool Person 2",
      },
      {
        id: 3,
        content: "Cool Person 3",
      },
      {
        id: 4,
        content: "Cool Person 4",
      },
      {
        id: 5,
        content: "Cool Person 5",
      },
      {
        id: 6,
        content: "Cool Person 6",
      },
      {
        id: 7,
        content: "Cool Person 7",
      },
    ],
    selected: [],
    squads: [
      {
        id: 0,
        name: "squad0",
        members: [
          {
            id: 8,
            content: "Cool Person 8",
          },
          {
            id: 9,
            content: "Cool Person 9",
          },
        ],
      },
    ],
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    droppable: "items",
    // droppable2: "selected",
    droppable2: "squad[0].members",
  };

  // getList = id => this.state[this.id2List[id]];

  getList = id => {
    if (id === "unsquadded") {
      return this.state.items;
    } else {
      return this.state.squads[Number(id)].members;
    }
  };

  onDragEnd = result => {
    const { source, destination } = result;

    console.log("source:", source);
    console.log("destination:", destination);
    console.log("result:", result);

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { items };

      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        items: result.droppable,
        selected: result.droppable2,
      });
    }
  };

  newOnDragEnd = result => {
    const { source, destination } = result;

    console.log("source:", source);
    console.log("destination:", destination);

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (destination.droppableId != "unsquadded") {
      // if destination is already full
      if (
        this.state.squads[Number(destination.droppableId)].members.length > 4
      ) {
        return;
      }
    }

    // dropped on the same table
    if (source.droppableId === destination.droppableId) {
      const newItems = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      if (source.droppableId === "unsquadded") {
        this.setState({
          items: newItems,
        });
      } else {
        this.setState({
          squads: [
            ...this.state.squads.slice(0, Number(source.droppableId)),
            {
              ...this.state.squads[source.droppableId],
              members: newItems,
            },
            ...this.state.squads.slice(Number(source.droppableId) + 1),
          ],
        });
      }
    } else {
      // if they are two different lists
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      console.log(result);

      if (source.droppableId === "unsquadded") {
        this.setState({
          items: result.source,
        });
      } else {
        this.setState({
          squads: [
            ...this.state.squads.slice(0, Number(source.droppableId)),
            {
              ...this.state.squads[source.droppableId],
              members: result.source,
            },
            ...this.state.squads.slice(Number(source.droppableId) + 1),
          ],
        });
      }
      if (destination.droppableId === "unsquadded") {
        this.setState({
          items: result.destination,
        });
      } else {
        this.setState({
          squads: [
            ...this.state.squads.slice(0, Number(destination.droppableId)),
            {
              ...this.state.squads[destination.droppableId],
              members: result.destination,
            },
            ...this.state.squads.slice(Number(destination.droppableId) + 1),
          ],
        });
      }

      //     result.source = sourceClone;
      // result.destination = destClone;

      // this.setState({
      //   items: result.droppable,
      //   selected: result.droppable2,
      // });
    }
  };

  addPerson = () => {
    let toAdd = {
      id: this.state.items.length + 100,
      content: "Person" + this.state.items.length + 100,
    };

    let newItems = [...this.state.items, toAdd];

    this.setState({ items: newItems });
  };

  addSquad = () => {
    let toAdd = {
      id: this.state.squads.length,
      name: "squad" + this.state.squads.length,
      members: [],
    };
    let newSquads = [...this.state.squads, toAdd];

    this.setState({ squads: newSquads });
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <NavSpacer />
        <NavSpacer />
        <NavSpacer />
        <DragDropContext onDragEnd={this.newOnDragEnd}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Unsquadded
              </Typography>
              <List>
                <Droppable droppableId="unsquadded">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {this.state.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <ListItem>
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <ListItemText>{item.content}</ListItemText>
                              </div>
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </List>
            </CardContent>
            <CardActions>
              <Button onClick={this.addPerson}>Add Person</Button>
            </CardActions>
          </Card>

          {this.state.squads.map((squad, index) => {
            return (
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {squad.name}
                  </Typography>

                  <Droppable droppableId={squad.id.toString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {squad.members.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                {item.content}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            );
          })}

          <Card className={classes.card}>
            <CardActions>
              <Button onClick={this.addSquad}>Add Squad</Button>
            </CardActions>
          </Card>

          {/* <Card>
            <Paper className={classes.paper}>
              <Droppable droppableId="droppable2">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {this.state.selected.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Paper>
          </Card> */}
          {/* </Grid> */}
          {/* </Grid> */}
        </DragDropContext>
      </div>
      // <DragDropContext onDragEnd={this.onDragEnd}>
      //   <Droppable droppableId="droppable">
      //     {(provided, snapshot) => (
      //       <div
      //         ref={provided.innerRef}
      //         style={getListStyle(snapshot.isDraggingOver)}
      //       >
      //         {this.state.items.map((item, index) => (
      //           <Draggable key={item.id} draggableId={item.id} index={index}>
      //             {(provided, snapshot) => (
      //               <div
      //                 ref={provided.innerRef}
      //                 {...provided.draggableProps}
      //                 {...provided.dragHandleProps}
      //                 style={getItemStyle(
      //                   snapshot.isDragging,
      //                   provided.draggableProps.style
      //                 )}
      //               >
      //                 {item.content}
      //               </div>
      //             )}
      //           </Draggable>
      //         ))}
      //         {provided.placeholder}
      //       </div>
      //     )}
      //   </Droppable>
      //   <Droppable droppableId="droppable2">
      //     {(provided, snapshot) => (
      //       <div
      //         ref={provided.innerRef}
      //         style={getListStyle(snapshot.isDraggingOver)}
      //       >
      //         {this.state.selected.map((item, index) => (
      //           <Draggable key={item.id} draggableId={item.id} index={index}>
      //             {(provided, snapshot) => (
      //               <div
      //                 ref={provided.innerRef}
      //                 {...provided.draggableProps}
      //                 {...provided.dragHandleProps}
      //                 style={getItemStyle(
      //                   snapshot.isDragging,
      //                   provided.draggableProps.style
      //                 )}
      //               >
      //                 {item.content}
      //               </div>
      //             )}
      //           </Draggable>
      //         ))}
      //         {provided.placeholder}
      //       </div>
      //     )}
      //   </Droppable>
      // </DragDropContext>
    );
  }
}

TestDnD.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TestDnD);
