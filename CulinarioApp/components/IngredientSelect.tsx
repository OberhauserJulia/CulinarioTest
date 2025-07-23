// Quelle: https://github.com/liptonzuma/React-Native-Dropdown

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { ChevronUp, ChevronDown } from 'lucide-react-native';
import { Searchbar } from 'react-native-paper';

type OptionItem = {
  value: string;
  label: string | React.JSX.Element;
};

interface DropDownProps {
  data: OptionItem[];
  onChange: (item: OptionItem) => void;
  placeholder: string;
}

export default function IngredientSelect({
  data,
  onChange,
  placeholder,
}: DropDownProps & { style?: any }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

  const [selectedItem, setSelectedItem] = useState<OptionItem | null>(null);

  const buttonRef = useRef<View>(null);

  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  const onSelect = useCallback((item: OptionItem) => {
    onChange(item);
    setSelectedItem(item);
    setExpanded(false);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(item =>
    item.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        ref={buttonRef}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setDropdownTop(layout.height);
          setDropdownWidth(layout.width);
        }}
      >
        <TouchableOpacity
          className="h-[55px] bg-lightbackground flex-row items-center justify-between rounded-[15px] px-[12px]"
          activeOpacity={0.8}
          onPress={toggleExpanded}
        >
          {selectedItem ? (
            typeof selectedItem.label === 'string' ? (
              <Text className="text-[16px] font-robotoMedium leading-[25px] text-white">{selectedItem.label}</Text>
            ) : (
              selectedItem.label
            )
          ) : (
            <Text className="text-[16px] font-robotoMedium leading-[25px] text-[#FFFFFF80]">{placeholder}</Text>
          )}
          {expanded ? <ChevronUp color="white" /> : <ChevronDown color="white" />}
        </TouchableOpacity>
        {expanded ? (
          <View
            className="absolute bg-lightbackground border border-primary rounded-[15px] max-h-[250px] z-10"
            style={{ top: dropdownTop, width: dropdownWidth }}
          >
            <Searchbar
              placeholder="Zutat suchen ..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              placeholderTextColor={'#FFFFFF80'}
              iconColor="#FFFFFF80"
              inputStyle={{ color: 'white' }}
              style={{ backgroundColor: '#222222', borderRadius: 15, padding: 0, margin: 0, borderBottomWidth: 1, borderBottomColor: '#161616' }}
            />
            <FlatList
              keyExtractor={(item) => item.value}
              data={filteredData}
              className="pl-[12px] "
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="h-[55px] flex justify-center border-b border-darkbackground"
                  onPress={() => onSelect(item)}
                >
                  {typeof item.label === 'string' ? (
                    <Text className="text-white font-robotoMedium leading-[25px]">{item.label}</Text>
                  ) : (
                    item.label
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}