// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

struct Point{
    string x;
    string y;
}

struct Polygon{
    Point [100] pList;
    uint numOfPoint;
}

struct Data{
    string pcno;
    string pmno;
    string scno;
    string county;
    uint townShip;
    string begDate;
    string endDate;
    uint reason;
    uint changeTag;
}

struct EventCreateParam{
    string Id;
    string createDate;
    string endDate;
    string county;
    uint townShip;
    uint reason;
    uint changedTag;
    Point[100] pList;
    uint numOfPoint;
    uint functional;
    string[] other;
}

struct FunctionCreateParam{
    string id;
    Data data;
    Polygon poly;
    string[] pa;
    uint functional;
    string[] other;
}
