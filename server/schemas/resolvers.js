const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
//const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          const res = await User.findOne({ _id: context.user._id }).select('-__v -password');
          return res
        }
  
        throw new AuthenticationError('Not logged in');
      },
      portfolio: async (parent, { _id }) => {
        const user = await User.findOne({ _id });
        
        const portfolio = user.portfolio[0]
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
        return portfolio
      }
  },
    Mutation: {
      addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
  
        return { token, user };
      },
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
  
        return { token, user };
      },
      savePortfolio: async (parent, { input }, context) => {
        if (context.user) {
          try {
            const res =  await User.findOneAndUpdate(
              { _id: context.user._id },
              {
                  $addToSet: { portfolio: input },
              },
              {
                  new: true,
                  runValidators: true,
              }
            );
            return res;
          } catch (err) {
            console.log(err)
          }
        }
        throw new AuthenticationError('You need to be logged in!');
      },
      editPortfolio: async (parent, { input }, context) => {
        if (context.user) {
          try {
            const remove =  await User.findOneAndUpdate(
              { _id: context.user._id },
              {
                $pop: { portfolio: -1},
              },
              {
                  new: true,
                  runValidators: true,
              }
            );
            const res =  await User.findOneAndUpdate(
              { _id: context.user._id },
              {
                $addToSet: { portfolio: input },
              },
              {
                  new: true,
                  runValidators: true,
              }
            );
            return res;
          } catch (err) {
            console.log(err)
          }
        }
        throw new AuthenticationError('You need to be logged in!');
      },
    }
  };
  
  module.exports = resolvers;