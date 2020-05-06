 
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import ReactMapGL from 'react-map-gl';

import Reply from './Reply';
import History from './History';
import Validate from './Validate';

import {subscribe, fetchAllChats, setTimetable, fetchTimetableChats } from '../../actions/chatActions';

import moment from 'moment';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { topicFromParams } from '../../lib/topicHelper'

export class Modal extends Component {

	constructor(props) {
		super(props);

		this.outerStyle = {
			position: "fixed",
			top: "50px",
			left: 0,
			width: "100%",
			height: "100%",
			overflow: "auto",
			zIndex: 1
		};

		// default style
		this.style = {
			modal: {
				position: "relative",
				width: 500,
				padding: 20,
				boxSizing: "border-box",
				backgroundColor: "#fff",
				margin: "40px auto",
				borderRadius: 3,
				zIndex: 2,
				textAlign: "left",
				boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
				...this.props.style.modal
			},
			overlay: {
				position: "fixed",
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0,0,0,0.5)",
				...this.props.style.overlay
			}
		};
	}

	// render modal
	render() {
		return (
			<div
				style={{
					...this.outerStyle,
					display: this.props.isModalOpen ? "block" : "none"
				}}
			>
				<div style={this.style.overlay} onClick={this.props.closeModal} />
				<div onClick={this.props.closeModal} />
				<div style={this.style.modal}>{this.props.children}</div>
			</div>
		);
	}
}

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  style: PropTypes.shape({
    modal: PropTypes.object,
    overlay: PropTypes.object
  })
};

const modalStyle = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0,0.5)"
	}
};

const mainStyle = {
	app: {
		margin: "120px 0"
	},
	buttonPrimary: {
		backgroundColor: "#408cec",
		border: 0,
		padding: "12px 20px",
		color: "#fff",
		margin: "0 auto",
		width: 150,
		display: "block",
		borderRadius: 3
  },
  cancelButton: {
		backgroundColor: "#da3f3f",
		border: 0,
		padding: "12px 20px",
		color: "#fff",
		margin: "0 auto",
		width: 150,
		display: "block",
		borderRadius: 3
	}
};

const events = [

 {
    "end":"2020-04-20T19:33:10.129Z",
    "identifier":"TEST City Run",
    "json":"any",
    "latitude":37.33180957,
    "longitude":-122.03053391,
    "radius":200,
    "start":"2020-04-20T18:33:10.129Z",
    "title":"5"
 },
 {
  "end":"",
  "identifier":"TEST2 City Run",
  "json":"any",
  "latitude":37.33180957,
  "longitude":-122.03053391,
  "radius":200,
  "start":"",
  "title":"5"
}
]

function Event({ event }) {
  return (
    <span>
      <strong>{event.identifier}</strong>
      { 'Latitude: ' + event.latitude}
      { 'Longitude: ' + event.longitude}
      {event.desc && ':  ' + event.desc}
    </span>
  )
}

function EventAgenda({ event }) {
  return (
    <span>
      <em style={{ color: 'magenta' }}>{event.identifier}</em>
      <p>{event.desc}</p>
      <p>{ 'Latitude: ' + event.latitude}</p>
      <p>{ 'Longitude: ' + event.longitude}</p>

      {/* // Process messages */}
    </span>
  )
}


export class Location extends Component {
  constructor(props) {
    super(props);

    console.log("Location")
    moment.locale('en-GB');

    this.state = {
      viewport: {
        width: 400,
        height: 600,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom:  -122.4376,
        isDragging: false,
        pitch: 50,
        bearing: 0
      }
    };

    this.state = { events }

    		// set initial state
		this.state = {
			isModalOpen: false,
      isInnerModalOpen: false,
      identifier: "",
      latitude: "",
      longitude: "",
      start: "",
      end: ""
		};

		// bind functions
		this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    
    this.onChange = this.onChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this)
  }


	// close modal (set isModalOpen, true)
	closeModal() {
		this.setState({
      isModalOpen: false,
      identifier: "",
      latitude: "",
      longitude: "",
      start: "",
      end: ""
    });
	}

	// open modal (set isModalOpen, false)
	openModal() {
		this.setState({
			isModalOpen: true
		});
	}

  componentDidMount() {
    const { params } = this.props.match;
    const topic = `${topicFromParams(params)}/+`;
    this.props.subscribe(topic);

    this.props.fetchAllChats();
  }

  handleSelect = (event) => {
    console.log("selected ", event)
    if (event.identifier)
      console.log({
        isModalOpen: true,
        identifier: event.identifier,
        latitude: event.latitude,
        longitude: event.longitude,
        start: event.start,
        end: event.end
      })
      this.setState({
        isModalOpen: true,
        identifier: event.identifier,
        latitude: event.latitude,
        longitude: event.longitude,
        start: event.start,
        end: event.end
      });

      console.log("load messages: ", this.props)
  }

  handleAdd = ({ start, end }) => {
      console.log("ADD")
      // Push event

      console.log(start, end)
      this.setState({
        isModalOpen: true,
        identifier: "",
        latitude: "",
        longitude: "",
        start: start.toJSON(),
        end: end.toJSON()
      });
  }

  onDelete() {
    if (this.state.identifier!= "")
      var removeIndex = this.props.timetables.map(function(item) { return item.identifier; }).indexOf(this.state.identifier);
      var new_array = events.splice(removeIndex, 1);

      this.props.setTimetable(`stream/${this.props.match.params.streamIdentifier}`, new_array)
      this.props.fetchAllChats();
  }

  onChange(e) {
    console.log("Submit");
    console.log(e.target.value)
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onFormSubmit(e) {
    if (this.state.identifier & this.state.start & this.state.end & this.state.longitude & this.state.latitude)
      console.log("Adding")
      this.props.setTimetable(`stream/${this.props.match.params.streamIdentifier}`,
        [
          ...this.props.timetables,
          {
            start: this.state.start,
            end: this.state.end,
            identifier: this.state.identifier,
            longitude: this.state.longitude,
            latitude: this.state.latitude,
          },
        ]
      )
      this.props.fetchAllChats();
      console.log("state", this.props.timetables);
    // IoT.publish(topic, JSON.stringify(msg));
    console.log(this.state);
  }

  render() {
    const { params } = this.props.match;
    const { viewport } = this.state;

    return (
      <div>
        <Header as="h1">Timetable Verification {params.streamIdentifier}</Header>
        <Grid>

          <Grid.Column>
            <div
              messages={this.props.messages}
              ref={(el) => { this.scrollDiv = el; }}
            >
              <p>
                <div>
                  <div style={mainStyle.app}>
                    {/* <button style={mainStyle.button} onClick={this.openModal}>
                      Open modal
                    </button> */}

                    <Modal
                      isModalOpen={this.state.isModalOpen}
                      closeModal={this.closeModal}
                      style={modalStyle}
                    >
                      
                      
                      
                      <p>{ Date(this.state.start) }</p>
                      <p>{ Date(this.state.end) }</p>
                      <Form onSubmit={this.onFormSubmit} >
                        <Form.Group>
                          <Form.Field>
                          <p>{ this.state.identifier }</p>
                            <Form.Input
                              name="identifier"
                              placeholder="Name"
                              value={this.state.identifier }
                              onChange={this.onChange}
                            />
                            <p>{ this.state.latitude }</p>
                            <Form.Input
                              name="latitude"
                              placeholder="Latitude"
                              value={this.state.latitude }
                              onChange={this.onChange}
                            />
                            <p>{ this.state.longitude }</p>
                            <Form.Input
                              name="longitude"
                              placeholder="Longitude"
                              value={this.state.longitude }
                              onChange={this.onChange}
                            />
                          </Form.Field>
                          <Button
                            type="submit"
                            disabled={this.props.messageValue === ''}
                            color="teal"
                          >
                            Save
                          </Button>
                        </Form.Group>
                      </Form>
                      {/* <img
                        width="100%"
                        style={{ borderRadius: 3 }}
                        src="https://source.unsplash.com/random"
                        alt="unsplash"
                      /> */}


                      <button
                        style={{
                          ...mainStyle.buttonPrimary,
                          margin: 0,
                          width: "auto",
                          marginTop: 10
                        }}
                        onClick={this.closeModal}
                      >
                        Done
                      </button>


                      <button 
                        style={{
                          ...mainStyle.cancelButton,
                          margin: 0,
                          width: "auto",
                          marginTop: 10
                        }}
                        onClick={this.onDelete}
                      >
                        Delete
                      </button>
                      <div style = {{height: "200px", overflow: "scroll"}}>
                        <Validate streamN={this.state.identifier} />
                      </div>
                    </Modal>
                  </div>
                </div>
              </p>
              
              <Calendar
                  selectable
                  defaultView={Views.AGENDA}
                        // scrollToTime={new Date(1970, 1, 1, 6)}
                        // defaultDate={new Date(2015, 3, 12)}
                        // onSelectEvent={event => alert(event.title)}
                        // onSelectSlot={this.handleSelect}

                  // events={this.state.events}
                  events={this.props.timetables}
                  // events={[]}
                  titleAccessor={(event) => event.identifier}
                  startAccessor={(event) => new Date(event.start)}
                  endAccessor={(event) => new Date(event.end)}
                  localizer={momentLocalizer(moment)}
                  onSelectEvent={this.handleSelect}
                  onSelectSlot={this.handleAdd}
                  components={
                    {
                      eventWrapper: ({ event, children }) => (
                        <div
                          onContextMenu={
                            e => { 
                              alert(`${event.identifier} is clicked.`);
                              e.preventDefault();
                            }
                          }
                        >
                          {children}
                        </div>
                      ),

                    }
                  }
                  components={{
                    event: Event,
                    agenda: {
                      event: EventAgenda,
                    },
                  }}
                />

              {/* <ReactMapGL
                mapboxApiAccessToken="pk.eyJ1IjoiamF5c2VuIiwiYSI6ImNpajdvNTA1YzAwMDF3N20yYXU4MnQ2d3YifQ.9HyC3LKWmMIj1Py1XlTlkw"
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({viewport})}
              /> */}

              <History />
              <Reply />
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

Location.propTypes = {
  subscribe: PropTypes.func.isRequired,
  fetchAllChats: PropTypes.func.isRequired,
  setTimetable: PropTypes.func.isRequired,
  fetchTimetableChats: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      streamIdentifier: PropTypes.string.isRequired,
    }),
  }).isRequired,


  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  chats: PropTypes.array.isRequired,
  timetables: PropTypes.array.isRequired
};

export const mapStateToProps = (state, ownProps) => {
  // Parse stream name from url path to fetch corresponding messages
  const { streamIdentifier } = ownProps.match.params;
  const streamStr = `${streamIdentifier}`;
  const stream = state.streams[streamStr];
  const chat_index = state.chat.allChats.map(function(item) { return item.name; }).indexOf(`stream/${streamIdentifier}`);
  const chat = state.chat.allChats[chat_index]
  let timetables = []
  if (chat){
    timetables = state.chat.allChats[chat_index].timetables;
  }
  
  console.log( stream ? stream.messages : [])
  return {
    messages: stream ? stream.messages : [],
    chat: chat ? chat : [],
    timetables: timetables ? timetables : []
  };
};

export default withRouter(connect(mapStateToProps, { subscribe, fetchAllChats, setTimetable, fetchTimetableChats})(Location));