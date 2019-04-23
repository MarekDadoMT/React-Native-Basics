import React, { Component } from 'react';  
import {Button, View, Text, TouchableOpacity, StyleSheet, Image, RefreshControl, ScrollView} from 'react-native';
import fb from '../firebase';
import UpdateItem from "./UpdateItem";

export default class Article extends Component {  

  constructor(props) {
    super(props);
    this.state = {
        author: '',
        category: '',
        image: 'http://www.tiptoncommunications.com/components/com_easyblog/themes/wireframe/images/placeholder-image.png',
        text: '',
        title: '',
        refreshing: false
    };
  }

  deleteArticle = async () => {
      const id = this.props.navigation.state.params.id;
      await fb.instance.deteleData(id, fb.instance.token);
      //this.props.navigation.navigate("List");
  };

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.componentDidMount().then(() => {
            this.setState({refreshing: false});
        });
    }
  
  async componentDidMount() {
    const id = this.props.navigation.state.params.id;
    const article = await fb.instance.showArticle(id, fb.instance.token);
    this.setState({author: article.author, category: article.category, image: article.image, text: article.text, title: article.title})
  }

    render() {
      const id = this.props.navigation.state.params.id;
      return (
          <ScrollView
              refreshControl={
                  <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                  />
              }>

          <Text style={styles.title}>{this.state.title}</Text>

          <View>
            <Image source={{ uri: this.state.image }}
                   style={{ width: '100%', height: '50%'}}
            />
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.heading}>Author: </Text>
            <Text style={{color: '#585858'}}>{this.state.author}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.heading}>Category: </Text>
            <Text style={{color: '#585858'}}>{this.state.category}</Text>
          </View>

          <View>
              <Text style={{color: '#585858', marginLeft: 30, marginTop: 10}} >{this.state.text}</Text>
          </View>

          <View>
              <TouchableOpacity style={styles.buttonContainerAdd}
                                onPress={() => this.props.navigation.navigate("UpdateItem", {
                                  id: id,
                                  title: this.state.title,
                                  author: this.state.author,
                                  category: this.state.category,
                                  text: this.state.text
                                })}
                >
                <Text style={styles.buttonText}>UPDATE ARTICLE</Text>
              </TouchableOpacity>




              <TouchableOpacity style={styles.buttonContainerAdd}
                                onPress={() => this.deleteArticle(this.state.id)}
              >
                <Text style={styles.buttonText}>DELETE ARTICLE</Text>
              </TouchableOpacity>

          </View>

          </ScrollView>
      );
    }
  }

  const styles = StyleSheet.create({
    title: {
      margin: 40,
      fontSize: 20,
      textAlign: 'center',
      color: '#585858',
      fontWeight: '700'
    },
    heading: {
        marginBottom: 10,
        marginLeft: 30,
        color: '#585858',
        fontWeight: '700'
      },
    container: {
     paddingTop: 200
    },
    input:{
        marginLeft: 30,
        marginRight: 30,
        height: 40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        padding: 10,
        color: 'grey'
    },
    inputText:{
      marginLeft: 30,
      marginRight: 30,
      height: 120,
      backgroundColor: 'rgba(225,225,225,0.2)',
      marginBottom: 10,
      padding: 10,
      color: 'grey'
  },
    buttonContainerAdd:{
        paddingTop: 10,
        marginLeft: 30,
        marginRight: 30,
        marginTop: 10,
        backgroundColor: 'grey',
        paddingVertical: 15,
        top: '95%',
        position: 'relative'
    },
    buttonContainerImage:{
      paddingTop: 10,
      marginLeft: 30,
      marginRight: 30,
      marginBottom: 10,
      backgroundColor: 'lightblue',
      paddingVertical: 15
  },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    }
});
