const RestaurantCartScreen = ({ onShowFees, onGoToCart }) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerWithTitle}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurants Cart</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView style={styles.restaurantList}>
        <View style={styles.restaurantCartItem}>
          <View style={styles.restaurantImageBox} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>Eden Kitchen</Text>
            <Text style={styles.restaurantSubtext}>Salad - 20 - 1item</Text>
            <Text style={styles.restaurantItemCount}>1 item</Text>
          </View>
          <Text style={styles.restaurantPrice}>$10.00</Text>
        </View>

        <View style={styles.restaurantCartItem}>
          <View style={styles.restaurantImageBox} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>Amado's Shawarma and Pizza</Text>
            <Text style={styles.restaurantSubtext}>Salad - 20 - 1item</Text>
            <Text style={styles.restaurantItemCount}>2 item</Text>
          </View>
          <Text style={styles.restaurantPrice}>$10.00</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.feesInfoButton} onPress={onShowFees}>
        <Text style={styles.feesInfoIcon}>ℹ️</Text>
        <Text style={styles.feesInfoText}>Fees Information</Text>
      </TouchableOpacity>

      <View style={styles.bottomButtonContainer}>
        <CustomButton 
          title="Go to Cart"
          onPress={onGoToCart}
        />
      </View>
    </View>
  );
};